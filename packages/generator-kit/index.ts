import _STATIC from "../../static.json" assert { type: "json" };
import { get as _get, isObject as _isObject } from "lodash";

import {
  GeneratorConfiguration,
  GeneratorFeatures,
  GeneratorSchema,
} from "./schemas/generator";

export function safeParse() {
  return GeneratorSchema.safeParse(_STATIC);
}

export function parse() {
  return GeneratorSchema.parse(_STATIC);
}

let __PARSED_STATIC: GeneratorConfiguration;
export function getStatic() {
  if (!__PARSED_STATIC) {
    __PARSED_STATIC = parse();
  }
  return __PARSED_STATIC;
}

export function getEnvironment() {
  return getStatic().data.attributes.globus.environment || null;
}

/**
 * @returns The redirect URI for the Globus Auth login page.
 * @private
 */
export function getRedirectUri() {
  /**
   * If the `redirect_uri` is specified in the `static.json`, use it.
   */
  if (getStatic().data.attributes.globus.application?.redirect_uri) {
    return getStatic().data.attributes.globus.application?.redirect_uri;
  }
  /**
   * If this is a static-managed deployment, use the `base_url` from the `static.json`.
   */
  if (getStatic()._static.host?.base_url) {
    return `${getStatic()._static.host?.base_url}/authenticate`;
  }
  /**
   * If all else fails, try to construct the redirect URI from the current location.
   * The fallback here is mostly to accoun`t` for SSR.
   * @todo This could likely be configured to get `basePath` and host information for the Next.js configuration or environment.
   */
  const baseURL = globalThis.location
    ? `${globalThis.location.protocol}//${globalThis.location.host}`
    : "";
  return `${baseURL}/authenticate`;
}

/**
 * Whether or not a feature is enabled in the `static.json`.
 * @private
 */
export function isFeatureEnabled(
  key: GeneratorFeatures,
  defaultValue?: boolean,
) {
  return Boolean(getStatic().data.attributes.features?.[key] ?? defaultValue);
}

/**
 * @private
 */
export function withFeature<T>(
  key: GeneratorFeatures,
  a: () => T,
  b: () => T | null = () => null,
) {
  return isFeatureEnabled(key) ? a() : b();
}

export function getMetadata() {
  return {
    title: getStatic().data.attributes.metadata?.title || "Search Portal",
    description: getStatic().data.attributes.metadata?.description || "",
  };
}

let jsonata: typeof import("jsonata") | null = null;

/**
 * Get a value from an object using a key that can be a JSONata expression.
 * @private
 */
export async function getValueFrom<T>(
  obj: unknown,
  key: unknown,
  defaultValue?: T,
): Promise<T | undefined> {
  if (!key || obj === null || obj === undefined || typeof key !== "string") {
    return defaultValue;
  }

  const useJSONata = isFeatureEnabled("jsonata");
  if (!useJSONata) {
    return _get(obj, key, defaultValue) as T;
  }

  if (!jsonata) {
    jsonata = (await import("jsonata")).default;
  }
  const expression = jsonata(key);
  return (await expression.evaluate(obj)) || defaultValue;
}

export function isObjectWithProperty(
  test: unknown,
  property: string,
): test is Record<string, unknown> {
  return _isObject(test) && property in test;
}

export const get = _get;

// GENERATOR-SPECIFIC UTILITIES

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
