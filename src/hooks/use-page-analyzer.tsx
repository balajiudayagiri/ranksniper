/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";

interface PageSpeedResponse {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      accessibility?: { score: number };
      "best-practices"?: { score: number };
      seo?: { score: number };
      pwa?: { score: number }; // Added PWA category
    };
    audits?: Record<string, any>;
    runtimeError?: {
      code: string;
      message: string;
    };
  };
  loadingExperience?: {
    metrics?: Record<string, any>;
  };
  error?: {
    message: string;
  };
}

interface PageSpeedAuditResult {
  mobileData: PageSpeedResponse | null;
  desktopData: PageSpeedResponse | null;
  loading: boolean;
  error: string | null;
  fetchAuditData: (url: string) => Promise<void>;
}

export function usePageSpeedAudit(): PageSpeedAuditResult {
  const [mobileData, setMobileData] = useState<PageSpeedResponse | null>(null);
  const [desktopData, setDesktopData] = useState<PageSpeedResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditData = useCallback(async (url: string): Promise<void> => {
    if (!url) {
      setError("URL is empty.");
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    setError(null);
    setMobileData(null);
    setDesktopData(null);

    try {
      const apiKey = process.env.PAGESPEED_API_KEY;

      if (!apiKey) {
        throw new Error("PageSpeed API key is not configured");
      }

      const categories = [
        "performance",
        "accessibility",
        "best-practices",
        "seo",
        "pwa",
      ];
      // Construct the category query string by repeating the 'category' parameter
      const categoryQuery = categories
        .map((cat) => `category=${cat}`)
        .join("&");

      const mobileApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&key=${apiKey}&strategy=mobile&${categoryQuery}`;
      const desktopApiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&key=${apiKey}&strategy=desktop&${categoryQuery}`;

      const [mobileResponse, desktopResponse] = await Promise.all([
        fetch(mobileApiUrl),
        fetch(desktopApiUrl),
      ]);

      const mobileDataResult = await mobileResponse.json();
      const desktopDataResult = await desktopResponse.json();

      if (!mobileResponse.ok) {
        throw new Error(
          mobileDataResult.error?.message ||
            mobileDataResult.lighthouseResult?.runtimeError?.message || // Check for runtimeError message
            "Failed to fetch mobile data from PageSpeed Insights API."
        );
      }
      if (!desktopResponse.ok) {
        throw new Error(
          desktopDataResult.error?.message ||
            desktopDataResult.lighthouseResult?.runtimeError?.message || // Check for runtimeError message
            "Failed to fetch desktop data from PageSpeed Insights API."
        );
      }

      setMobileData(mobileDataResult);
      setDesktopData(desktopDataResult);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Error in usePageSpeedAudit:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { mobileData, desktopData, loading, error, fetchAuditData };
}
