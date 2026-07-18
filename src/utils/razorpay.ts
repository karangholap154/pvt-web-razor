/**
 * Dynamically loads the Razorpay checkout script if it is not already loaded.
 * Returns a Promise that resolves to true if the script was successfully loaded,
 * or false if loading failed or if it is invoked on the server side.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    // If Razorpay is already available, resolve immediately
    if ((window as Window & { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }

    // Check if the script tag is already in the DOM (e.g., loaded by another page/component)
    const scriptSrc = "https://checkout.razorpay.com/v1/checkout.js";
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;

    if (existingScript) {
      // Script is already added. Listen for load/error events if not loaded yet
      const handleLoad = () => resolve(true);
      const handleError = () => resolve(false);

      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);
      return;
    }

    // Create and inject the script tag
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    
    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}
