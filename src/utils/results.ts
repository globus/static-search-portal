import { areSEOResultsEnabled } from "../../static";
/**
 * Get the link to the results page for a given subject, accounting for the current configuration.
 */
export function getResultLink(subject: string) {
  const urlSafeSubject = encodeURIComponent(subject);
  /**
   * If `features.seo_results` is enabled, we'll use the build-time generated result pages.
   */
  return areSEOResultsEnabled
    ? `/results/${urlSafeSubject}`
    : `/results?subject=${urlSafeSubject}`;
}
