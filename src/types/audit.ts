export interface AuditHeading {
  key: string;
  itemType?: string;
  valueType: string;
  label: string;
  granularity?: number;
  displayUnit?: string;
  tooltip?: string;
  subItemsHeading?: {
    key: string;
    itemType: string;
    valueType: string;
    label: string;
  };
}

export interface AuditDetails {
  type: string;
  headings?: AuditHeading[];
  items?: Array<Record<string, any>>;
  debugData?: {
    type: string;
    urls?: string[];
    tasks?: Array<Record<string, any>>;
    wastedBytes?: number;
    metricSavings?: {
      LCP?: number;
      FCP?: number;
      TBT?: number;
    };
  };
  overallSavingsBytes?: number;
  overallSavingsMs?: number;
  scale?: number;
}
