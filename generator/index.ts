import { getStatic, isFeatureEnabled } from "@from-static/generator-kit";

/**
 * Whether or not the Globus Transfer is enabled based on the state of the `static.json`.
 */
export function isTransferEnabled() {
  return (
    isFeatureEnabled("transfer") ||
    Boolean(getStatic().data.attributes.components?.Result?.globus?.transfer)
  );
}

/**
 * Whether or not a user can "Sign In" to the portal.
 * If Transfer functionality is enabled (`isTransferEnabled`), then authentication is enabled.
 */
export function isAuthenticationEnabled() {
  return isTransferEnabled() || isFeatureEnabled("authentication");
}
