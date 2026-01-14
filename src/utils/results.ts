import { isFeatureEnabled } from "../../static-lib";
/**
 * Get the link to the results page for a given subject, accounting for the current configuration.
 */
export function getResultLink(subject: string) {
  const urlSafeSubject = encodeURIComponent(subject);
  /**
   * If `features.seoResults` is enabled, we'll use the build-time generated result pages.
   */
  return isFeatureEnabled("seoResults")
    ? `/results/${urlSafeSubject}`
    : `/results?subject=${urlSafeSubject}`;
}
