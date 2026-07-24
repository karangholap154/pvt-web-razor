import Razorpay from "razorpay";

/**
 * Returns a server-side instance of Razorpay after validating environment credentials.
 * Throws a descriptive error if environment variables are missing.
 */
export function getRazorpayServerInstance(): Razorpay {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials (NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing from environment variables."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}
