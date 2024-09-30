import { GError as _GError } from "@globus/sdk/services/search/types";

export type GError = _GError;

export function isGError(result: unknown): result is GError {
  return (
    typeof result === "object" &&
    result !== null &&
    "@datatype" in result &&
    result["@datatype"] === "GError"
  );
}
