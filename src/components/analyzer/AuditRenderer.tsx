/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "ranksniper/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ranksniper/components/ui/card";
import { linkifyMarkdownTextToJSX } from "ranksniper/lib/helper";

// Define the shape of a single audit item for clarity
interface SingleAuditData {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  metricSavings?: Record<string, number>;
  details?: {
    type: string;
    headings: Array<{
      key: string;
      valueType: string;
      label: string;
    }>;
    items: Array<any>;
    overallSavingsMs?: number;
    overallSavingsBytes?: number;
  };
  warnings?: string[];
}

// Props for the individual audit component
interface AuditComponentProps {
  auditData: SingleAuditData;
}

// Helper function to format values based on their type
const formatValue = (value: any, valueType: string) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  switch (valueType) {
    case "bytes":
      return `${(value / 1024).toFixed(2)} KB`;
    case "ms":
      return `${value} ms`;
    case "url":
      if (typeof value === "string") {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all">
            {value}
          </a>
        );
      }
      return value.toString();
    case "code":
      return (
        <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-1 rounded">
          {value}
        </pre>
      );
    case "thumbnail":
      if (typeof value === "string") {
        return <img src={value} alt="thumbnail" className="w-16 h-auto" />;
      }
      return "N/A";
    default:
      return value.toString();
  }
};

// The component for rendering a single audit (re-used and renamed for broader use)
export function AuditDisplay({ auditData }: AuditComponentProps) {
  const {
    title,
    description,
    score,
    scoreDisplayMode,
    displayValue,
    numericValue,
    numericUnit,
    metricSavings,
    details,
    warnings,
  } = auditData;

  const getScoreStatus = (score: number | null, mode: string) => {
    if (mode === "notApplicable") return "Not Applicable";
    if (mode === "manual") return "Manual Review Required";
    if (score === null) return "N/A";

    switch (mode) {
      case "binary":
        return score === 1 ? "Optimal" : "Needs Improvement";
      case "numeric":
      case "metricSavings":
      case "opportunity":
        return score === 1 ? "Optimal" : "Needs Improvement";
      default:
        return `Score: ${score}`;
    }
  };

  const status = getScoreStatus(score, scoreDisplayMode);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {linkifyMarkdownTextToJSX(description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible>
          <AccordionItem value={`${auditData.id}-details`}>
            <AccordionTrigger className="font-semibold">
              Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2">
                <span className="text-sm font-semibold">Audit Status:</span>{" "}
                <span
                  className={`font-bold ${
                    score === 1
                      ? "text-green-500"
                      : score === 0
                      ? "text-red-500"
                      : "text-gray-600"
                  }`}>
                  {status}
                </span>
              </div>

              {displayValue && (
                <div className="py-2 text-sm">
                  <span className="font-semibold">Value:</span> {displayValue}
                </div>
              )}

              {(numericValue !== undefined || numericUnit) && (
                <div className="py-2 text-sm">
                  <span className="font-semibold">Numeric Value:</span>{" "}
                  {numericValue} {numericUnit}
                </div>
              )}

              {metricSavings && Object.keys(metricSavings).length > 0 && (
                <div className="py-2 text-sm">
                  <span className="font-semibold">
                    Potential Metric Savings:
                  </span>
                  <ul className="list-disc pl-5">
                    {Object.entries(metricSavings).map(([metric, savings]) => (
                      <li key={metric}>
                        {metric}: {savings} ms
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(details?.overallSavingsMs !== undefined ||
                details?.overallSavingsBytes !== undefined) &&
                (details.overallSavingsMs! > 0 ||
                  details.overallSavingsBytes! > 0) && (
                  <div className="py-2 text-sm">
                    <span className="font-semibold">Overall Savings:</span>
                    <ul className="list-disc pl-5">
                      {details.overallSavingsMs !== undefined &&
                        details.overallSavingsMs > 0 && (
                          <li>Time: {details.overallSavingsMs} ms</li>
                        )}
                      {details.overallSavingsBytes !== undefined &&
                        details.overallSavingsBytes > 0 && (
                          <li>
                            Size:{" "}
                            {formatValue(details.overallSavingsBytes, "bytes")}
                          </li>
                        )}
                    </ul>
                  </div>
                )}

              {warnings && warnings.length > 0 && (
                <div className="py-2 text-sm text-yellow-600">
                  <span className="font-semibold">Warnings:</span>
                  <ul className="list-disc pl-5">
                    {warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {details &&
              details.items &&
              details.items.length > 0 &&
              details.type &&
              (details.type === "table" || details.type === "opportunity") ? (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {details.headings.map((heading) => (
                          <th
                            key={heading.key}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {heading.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {details.items.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          {details.headings.map((heading) => (
                            <td
                              key={`${itemIndex}-${heading.key}`}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatValue(
                                item[heading.key],
                                heading.valueType
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-2 text-sm text-gray-600">
                  {score === 1
                    ? "No issues detected for this audit."
                    : scoreDisplayMode === "notApplicable"
                    ? "This audit was not applicable."
                    : scoreDisplayMode === "manual"
                    ? "Requires manual review, no automatic details available."
                    : "No specific details available."}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

// Wrapper component to render an array of audits
interface AuditRendererProps {
  auditIds: string[];
  data: any;
  title: string;
  type: string;
  key: string;
}

export function AuditRenderer({
  key,
  auditIds,
  data,
  type,
  title,
}: AuditRendererProps) {
  const audits = data?.lighthouseResult?.audits || {};

  // Filter audits based on type and availability
  const filteredAuditIds = auditIds.filter((id) => {
    const auditData = audits[id];
    return (
      auditData &&
      auditData.scoreDisplayMode !== "notApplicable" &&
      auditData.score !== 1
    );
  });

  if (filteredAuditIds.length === 0) {
    return null; // Do not render anything if no audits to display
  }

  return (
    <div aria-label={type} className="space-y-4" key={key}>
      <h2 className="text-2xl font-bold">{title || "Audit"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAuditIds.map((id) => {
          const auditData = audits[id];
          return <AuditDisplay key={id} auditData={auditData} />;
        })}
      </div>
    </div>
  );
}
