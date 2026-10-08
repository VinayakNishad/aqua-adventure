import { useEffect } from "react";
import env from "../config/env";

/** Loads Google Analytics after the page is idle, in production only. */
export default function useGoogleAnalytics() {
  useEffect(() => {
    const gaId = env.gaMeasurementId;
    if (!env.isProduction || !gaId) return undefined;

    let cancelled = false;

    const loadAnalytics = () => {
      if (cancelled || document.getElementById("gtag-script")) return;

      const script = document.createElement("script");
      script.id = "gtag-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // gtag requires the `arguments` object, not a spread array.
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId);
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(loadAnalytics, { timeout: 3000 });
      } else {
        window.setTimeout(loadAnalytics, 1500);
      }
    };

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, []);
}
