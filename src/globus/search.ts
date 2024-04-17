export type SearchEntry = {
  entry_id: string | null;
  matched_principal_sets: string[];
  content: {
    [key: string]: unknown;
  };
};

export type GMetaResult = {
  "@datatype": "GMetaResult";
  "@version": string;
  subject: string;
  entries: SearchEntry[];
};

export type GBucket = {
  "@datatype": "GBucket";
  "@version": string;
  value: string | Record<string, unknown>;
  count: number;
};

export type GFacetResult = {
  "@datatype": "GFacetResult";
  "@version": string;
  name: string;
  value?: number;
  buckets: GBucket[];
};

export type GSearchResult = {
  "@datatype": "GSearchResult";
  "@version": string;
  offset: number;
  total: number;
  has_next_page: boolean;
  facet_results?: GFacetResult[];
  gmeta: GMetaResult[];
};

export type GError = {
  "@datatype": "GError";
  message: string;
  code: string;
  request_id: string;
  status: number;
  error: Record<string, unknown> | Array<GError>;
  error_data?: Record<string, unknown> | Array<unknown>;
};

export function isGError(result: unknown): result is GError {
  return (
    typeof result === "object" &&
    result !== null &&
    "@datatype" in result &&
    result["@datatype"] === "GError"
  );
}
