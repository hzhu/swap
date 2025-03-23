"use client";

import { ampli, type Event, type EventOptions } from "@/ampli";

// Initialize Amplitude only on the client side once
export function initAnalytics() {
  if (!process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    throw new Error("Missing NEXT_PUBLIC_AMPLITUDE_API_KEY");
  }

  if (typeof window !== "undefined") {
    ampli.load({
      client: {
        apiKey: process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY,
        configuration: {
          serverUrl: "/api/analytics",
          autocapture: {
            pageViews: false,
          },
        },
      },
    });
  }
}
