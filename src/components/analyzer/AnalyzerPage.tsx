/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { usePageSpeedAudit } from "ranksniper/hooks/use-page-analyzer";
import { Button } from "ranksniper/components/ui/button";
import { Input } from "ranksniper/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "ranksniper/components/ui/tabs";
import { Monitor, Phone } from "lucide-react";
import { PerformanceMeters } from "./PerformanceMeters";
import { PerformanceBarChart } from "./PerformanceBarChart";
import { MetricsTimeline } from "./MetricsTimeline";
import { ResourceUsage } from "./ResourceUsage";
import mobileData from "ranksniper/lib/mobile-mock.json";
import desktopData from "ranksniper/lib/desktop-mock.json";
import { AuditRenderer } from "./AuditRenderer";

// Define the tabs content with audit categories for better structure
const tabContent = [
  {
    label: "Performance",
    audits: [
      "cumulative-layout-shift",
      "first-contentful-paint",
      "total-blocking-time",
      "largest-contentful-paint",
    ],
    type: "performance",
  },
  {
    label: "Accessibility",
    audits: [
      "label",
      "user-timings",
      "dom-size",
      "notification-on-start",
      "redirects",
      "frame-title",
      "main-thread-tasks",
      "image-delivery-insight",
      "landmark-one-main",
      "custom-controls-roles",
      "no-document-write",
      "is-crawlable",
      "font-display-insight",
      "uses-responsive-images",
    ],
    type: "accessibility",
  },
  {
    label: "Resource Optimization",
    audits: [
      "render-blocking-resources",
      "unminified-css",
      "uses-optimized-images",
      "unminified-javascript",
      "unused-css-rules",
      "unused-javascript",
      "total-byte-weight",
      "uses-text-compression",
    ],
    type: "resourceOptimization",
  },
  {
    label: "Load Performance",
    audits: [
      "offscreen-images",
      "uses-rel-preconnect",
      "network-requests",
      "long-tasks",
      "critical-request-chains",
      "server-response-time",
      "first-contentful-paint",
      "largest-contentful-paint",
      "interactive",
      "speed-index",
      "total-blocking-time",
      "estimated-input-latency",
      "experimental-interaction-to-next-paint",
    ],
    type: "loadPerformance",
  },
  {
    label: "Image Optimization",
    audits: [
      "image-aspect-ratio",
      "image-elements",
      "image-size-responsive",
      "image-size-optimized",
      "image-size-encoding",
      "image-size-web-optimized",
    ],
    type: "imageOptimization",
  },
  {
    label: "ARIA Attributes",
    audits: [
      "aria-required-attr",
      "aria-allowed-attr",
      "aria-valid-attr-value",
      "aria-valid-attr",
      "aria-command-name",
      "aria-input-field-name",
      "aria-labelledby-or-description",
      "aria-hidden-focus",
      "aria-required-children",
      "aria-required-parent",
      "aria-roles",
    ],
    type: "accessibility",
  },
  {
    label: "Content & Structure",
    audits: [
      "image-alt",
      "link-name",
      "button-name",
      "color-contrast",
      "tabindex",
      "heading-order",
      "document-title",
      "html-has-lang",
      "font-size",
    ],
    type: "contentStructure",
  },
  {
    label: "Indexing & Crawling",
    audits: [
      "robots-txt",
      "canonical",
      "http-status-code",
      "mobile-friendly",
      "crawlable-text",
    ],
    type: "indexingCrawling",
  },
  {
    label: "Content & Metadata SEO",
    audits: [
      "hreflang",
      "hreflang-consistency",
      "meta-description",
      "structured-data",
      "structured-data-valid",
    ],
    type: "contentMetadata",
  },
  {
    label: "Best Practices",
    audits: [
      "content-security-policy",
      "no-vulnerable-libraries",
      "no-referrers-on-external-domains",
      "csp-xss",
      "mixed-content",
    ],
    type: "bestPractices",
  },
  {
    label: "Security",
    audits: [
      "deprecations",
      "errors-in-console",
      "doctype",
      "js-libraries",
      "external-anchors-use-rel-noopener",
    ],
    type: "security",
  },
  {
    label: "User Experience",
    audits: [
      "geolocation-on-start",
      "no-autoplay-audio",
      "no-distracting-elements",
      "uses-passive-event-listeners",
      "prefers-reduced-motion",
    ],
    type: "userExperience",
  },
  {
    label: "Manifest & Service Worker",
    audits: [
      "installable-manifest",
      "service-worker",
      "pwa-start-url",
      "splash-screen-config",
      "offline-start-url",
    ],
    type: "manifestServiceWorker",
  },
  {
    label: "PWA User Experience",
    audits: [
      "pwa-cross-browser",
      "pwa-page-transitions",
      "pwa-each-page-has-url",
      "viewport",
      "apple-touch-icon",
      "maskable-icon",
      "themed-omnibox",
      "fast-a2hs",
    ],
    type: "userExperience",
  },
];

export default function AnalyzerPage() {
  const [url, setUrl] = useState("");
  const [inputError, setInputError] = useState("");
  const [activeDevice, setActiveDevice] = useState<"mobile" | "desktop">(
    "mobile"
  );
  const { loading, error, fetchAuditData } = usePageSpeedAudit();

  const handleAnalyze = async () => {
    setInputError(""); // Reset input error
    if (!url.trim()) {
      setInputError("Please enter a URL");
      return;
    }
    try {
      new URL(url); // This will throw an error if URL is invalid
      await fetchAuditData(url);
    } catch {
      setInputError("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  const renderTabContent = (deviceData: any) => {
    const { lighthouseResult } = deviceData;
    const { audits, categories } = lighthouseResult;

    return (
      <>
        <PerformanceMeters
          scores={{
            performance: categories?.performance?.score,
            accessibility: categories?.accessibility?.score,
            bestPractices: categories?.["best-practices"]?.score,
            seo: categories?.seo?.score,
          }}
        />
        <PerformanceBarChart
          metrics={{
            FCP: audits?.["first-contentful-paint"]?.numericValue || 0,
            LCP: audits?.["largest-contentful-paint"]?.numericValue || 0,
            TBT: audits?.["total-blocking-time"]?.numericValue || 0,
            CLS: audits?.["cumulative-layout-shift"]?.numericValue || 0,
            TTI: audits?.["interactive"]?.numericValue || 0,
          }}
        />
        {tabContent.map((tab) => (
          <AuditRenderer
            key={tab.type}
            auditIds={tab.audits}
            data={deviceData}
            type={tab.type}
            title={`${tab.label} Audits`}
          />
        ))}
        <MetricsTimeline
          metrics={{
            FCP: audits?.["first-contentful-paint"]?.numericValue || 0,
            LCP: audits?.["largest-contentful-paint"]?.numericValue || 0,
            TBT: audits?.["total-blocking-time"]?.numericValue || 0,
            CLS: audits?.["cumulative-layout-shift"]?.numericValue || 0,
            TTI: audits?.["interactive"]?.numericValue || 0,
          }}
        />
        <ResourceUsage details={audits?.["network-requests"]?.details || {}} />
      </>
    );
  };

  useEffect(() => {
    console.info({
      mobile: mobileData,
      desktop: desktopData,
      error,
      timestamp: new Date().toISOString(),
    });
  }, [mobileData, desktopData, error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        URL Performance & Audit Analyzer
      </h1>
      <div className="flex flex-col space-y-8">
        {/* URL Input Section */}
        <div className="max-w-xl mx-auto w-full">
          <Input
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setInputError(""); // Clear error on input change
            }}
            className={`w-full ${inputError ? "border-red-500" : ""}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAnalyze();
            }}
          />
          {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
          <Button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="w-full">
            {loading ? "Analyzing..." : "Analyze URL"}
          </Button>
        </div>

        {/* Results Section */}
        {(mobileData || desktopData) && (
          <div className="space-y-6">
            <Tabs
              defaultValue={activeDevice}
              onValueChange={(value) =>
                setActiveDevice(value as "mobile" | "desktop")
              }
              className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Performance Analysis</h2>
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger
                    value="mobile"
                    className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger
                    value="desktop"
                    className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="mobile" className="space-y-6">
                {renderTabContent(mobileData)}
              </TabsContent>

              <TabsContent value="desktop" className="space-y-6">
                {renderTabContent(desktopData)}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto w-full">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
