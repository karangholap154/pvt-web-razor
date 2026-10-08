"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/providers/ToastProvider";
import { supabase } from "@/utils/supabaseClient";
import { loadRazorpayScript } from "@/utils/razorpay";

export type CheckoutStatus = "idle" | "verifying" | "paying" | "success" | "error";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayWindow extends Window {
  Razorpay?: new (options: unknown) => { open: () => void };
}

export interface UseRazorpayCheckoutOptions {
  onSuccess?: (noteId: string) => void;
}

export function useRazorpayCheckout(options?: UseRazorpayCheckoutOptions) {
  const toast = useToast();
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  const startCheckout = useCallback(
    async (note: { id: string; title: string }, email: string) => {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        toast.warning("Please provide your email address to continue.");
        return;
      }

      setCheckoutStatus("verifying");
      try {
        // Double check database logs for past purchase before creating order
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("email", cleanEmail)
          .eq("note_id", note.id)
          .eq("status", "success")
          .maybeSingle();

        if (purchase) {
          setCheckoutStatus("success");
          if (options?.onSuccess) {
            options.onSuccess(note.id);
          }
          return;
        }

        setCheckoutStatus("paying");
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId: note.id, email: cleanEmail }),
        });

        const orderData = await res.json();
        if (orderData.error) {
          toast.error(`Checkout order error: ${orderData.error}`);
          setCheckoutStatus("idle");
          return;
        }

        setActiveOrderId(orderData.orderId);

        // Load Razorpay gateway script
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Failed to load Razorpay payment gateway. Please check your internet connection.");
          setCheckoutStatus("idle");
          return;
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          toast.error("Payment Service is currently unavailable. Please try again later or contact support.");
          setCheckoutStatus("idle");
          return;
        }

        const razorpayOptions = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Private Academy",
          description: `Unlock ${note.title}`,
          order_id: orderData.orderId,
          prefill: { email: cleanEmail },
          handler: async function (response: RazorpayResponse) {
            try {
              setCheckoutStatus("verifying");
              const verifyRes = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  noteId: note.id,
                  email: cleanEmail,
                  amount: orderData.amount,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                toast.success("Payment verified successfully! Access granted.");
                setCheckoutStatus("success");
                if (options?.onSuccess) {
                  options.onSuccess(note.id);
                }
              } else {
                toast.error(`Verification failed: ${verifyData.error}`);
                setCheckoutStatus("idle");
              }
            } catch (err) {
              console.error("Verification callback failed:", err);
              toast.error("Verification check failed.");
              setCheckoutStatus("idle");
            }
          },
          modal: {
            ondismiss: function () {
              setCheckoutStatus("idle");
            },
          },
          theme: { color: "#fbbf24" },
        };

        const rzpWindow = window as unknown as RazorpayWindow;
        if (rzpWindow.Razorpay) {
          const rzp = new rzpWindow.Razorpay(razorpayOptions);
          rzp.open();
        }
      } catch (err) {
        console.error("Checkout flow failed:", err);
        toast.error("Error starting checkout process.");
        setCheckoutStatus("idle");
      }
    },
    [toast, options]
  );

  const syncPayment = useCallback(
    async (orderIdToSync?: string) => {
      const targetOrderId = orderIdToSync || activeOrderId;
      if (!targetOrderId) return false;

      setCheckoutStatus("verifying");
      try {
        const res = await fetch("/api/verify-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: targetOrderId }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("Payment verified successfully! Access granted.");
          setCheckoutStatus("success");
          return true;
        } else {
          toast.warning(data.message || "Payment not recorded yet.");
          setCheckoutStatus("idle");
          return false;
        }
      } catch (err) {
        console.error("Manual sync failed:", err);
        toast.error("Error checking payment status.");
        setCheckoutStatus("idle");
        return false;
      }
    },
    [activeOrderId, toast]
  );

  return {
    checkoutStatus,
    setCheckoutStatus,
    activeOrderId,
    startCheckout,
    syncPayment,
  };
}
