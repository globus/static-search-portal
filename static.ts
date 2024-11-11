import _STATIC from "./static.json" with { type: "json" };
import { defaultsDeep, get as _get } from "lodash";
import { ThemeSettings } from "@/theme";

import type { ResultListingComponentOptions } from "@/components/ResultListing";
import type { ResultComponentOptions } from "@/components/Result";
import { NavigationOptions } from "@/components/Navigation";

import type { GFacet } from "@globus/sdk/services/search/service/query";

/**
 * The base type for a `static.json` file.
 */
export type Base = {
  _static: {
    generator: {
      /**
       * The name of the generator used to build the `static.json` file.
       * This should be a reference to the package name of the generator.
       * @example "@globus/static-data-portal"
       */
      name: string;
    };
    /**
     * GitHub Action-injected environment variables.
     * @see https://github.com/from-static/actions
     */
    host?: {
      base_url: string;
      origin: string;
      host: string;
      base_path: string;
    };
  };
  data: {
    version: string;
    attributes: Record<string, unknown>;
  };
};

/**
 * The type used for `data` by the [@globus/static-search-portal generator](https://github.com/globus/static-search-portal).
 */
export type Data = {
  /**
   * The version of the `data` object, which is used to determine how
   * the generator will render its `attributes`.
   * @example "1.0.0"
   */
  version: string;
  attributes: {
    features?: {
      /**
       * Enable JSONata support for processing the `static.json` file.
       * @see https://jsonata.org/
       */
      jsonata?: boolean;
      /**
       * Enable the Globus Auth functionality in the portal.
       */
      authentication?: boolean;
      /**
       * Force users to authenticate before accessing the portal, regardless of whether or not the
       * configured Globus Index is private.
       */
      requireAuthentication?: boolean;
      /**
       * Enables the Globus Transfer functionality in the portal.
       */
      transfer?: boolean;
      /**
       * Whether or not authorization data should be stored in LocalStorage
       */
      useLocalStorage?: boolean;
      /**
       * Enable SEO results in the portal; This feature is not yet available.
       * @private
       */
      seo_results?: boolean;
    };

    theme?: ThemeSettings;

    metadata?: {
      title?: string;
      description?: string;
    };

    /**
     * The Content Security Policy (CSP) for the portal that will be included in a `<meta>` tag.
     * If no value is provided, a default CSP will be used.
     * If `false` is provided as the value, no CSP `<meta>` tag will be included.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
     */
    contentSecurityPolicy?: string | false;

    content?: {
      headline?: string;
      logo?: {
        src: string;
        alt?: string;
      };
      navigation?: NavigationOptions;
    };

    components?: {
      Result?: ResultComponentOptions;
      ResultListing?: ResultListingComponentOptions;
    };

    globus: {
      /**
       * The Globus platform environment.
       * @private
       */
      environment?: string;
      /**
       * Information about your registered Globus Auth Application (Client)
       * @see https://docs.globus.org/api/auth/developer-guide/#developing-apps
       */
      application?: {
        /**
         * The UUID of the client application.
         */
        client_id: string;
        /**
         * The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
         * The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
         * To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.
         * @example "https://example.com/data-portal/authenticate"
         */
        redirect_uri?: string;
        /**
         * Additional scopes to request from the Globus Auth service when authenticating.
         */
        scopes?: string[];
      };
      /**
       * Configuration for Search-related functionality in the portal.
       */
      search: {
        /**
         * The UUID of the Globus Search Index that will be used as the data source.
         */
        index: string;
        facets?: GFacet[];
      };
    };
  };
};

export type Static = Base & {
  data: Data;
};

/**
 * Reference to the `static.json` file.
 * @private
 */
export const STATIC: Static = _STATIC;

defaultsDeep(STATIC, {
  data: {
    attributes: {
      features: {
        /**
         * If a Globus Auth client ID is provided, `authentication` is enabled by default.
         */
        authentication: Boolean(
          STATIC.data.attributes?.globus?.application?.client_id,
        ),
      },
      components: {
        /**
         * For `summary` and `heading` properties the `Result` and `ResultListing` components
         * fallback to one another if not provided...
         */
        Result: {
          heading:
            STATIC.data.attributes?.components?.ResultListing?.heading ||
            "subject",
          summary:
            STATIC.data.attributes?.components?.ResultListing?.summary || null,
        },
        ResultListing: {
          heading:
            STATIC.data.attributes?.components?.Result?.heading || "subject",
          summary: STATIC.data.attributes?.components?.Result?.summary || null,
        },
      },
    },
  },
});

const {
  data: { attributes },
} = STATIC;

export function getEnvironment() {
  return attributes.globus.environment || null;
}

/**
 * @returns The redirect URI for the Globus Auth login page.
 * @private
 */
export function getRedirectUri() {
  /**
   * If the `redirect_uri` is specified in the `static.json`, use it.
   */
  if (attributes.globus.application?.redirect_uri) {
    return attributes.globus.application.redirect_uri;
  }
  /**
   * If this is a static-managed deployment, use the `base_url` from the `static.json`.
   */
  if (STATIC._static.host?.base_url) {
    return `${STATIC._static.host?.base_url}/authenticate`;
  }
  /**
   * If all else fails, try to construct the redirect URI from the current location.
   * The fallback here is mostly to account for SSR.
   * @todo This could likely be configured to get `basePath` and host information for the Next.js configuration or environment.
   */
  const baseURL = globalThis.location
    ? `${globalThis.location.protocol}//${globalThis.location.host}`
    : "";
  return `${baseURL}/authenticate`;
}

/**
 * Get a value by key (JSONPath) from the `static.json`.
 * @private
 */
export function get(key: string, defaultValue?: any) {
  return _get(STATIC, key, defaultValue);
}
/**
 * Get an attribute (`data.attributes` member) by key from the `static.json`.
 * @private
 */
export function getAttribute(key: string, defaultValue?: any) {
  return get(`data.attributes.${key}`, defaultValue);
}

/**
 * Whether or not a feature is enabled in the `static.json`.
 * @private
 */
export function isFeatureEnabled(key: string, defaultValue?: boolean) {
  return Boolean(get(`data.attributes.features.${key}`, defaultValue));
}
/**
 * @private
 */
export function withFeature<T>(
  key: string,
  a: () => T,
  b: () => T | null = () => null,
) {
  return isFeatureEnabled(key) ? a() : b();
}

let jsonata: typeof import("jsonata") | null = null;

/**
 * - Resolve a value for the provided attribute`key` from the `static.json` file.
 * - Call `getValueFrom` with the resolved key.
 * @private
 */
export async function getValueFromAttribute<T>(
  obj: Record<string, unknown>,
  key: string,
  defaultValue?: T,
): Promise<T | undefined> {
  const resolvedKey = getAttribute(key);
  return await getValueFrom<T>(obj, resolvedKey, defaultValue);
}

export async function getValueFrom<T>(
  obj: Record<string, any>,
  key: string,
  defaultValue?: T,
): Promise<T | undefined> {
  const useJSONata = isFeatureEnabled("jsonata");
  if (useJSONata && !jsonata) {
    jsonata = (await import("jsonata")).default;
  }
  if (useJSONata && jsonata && key) {
    const expression = jsonata(key);
    return (await expression.evaluate(obj)) || defaultValue;
  }
  return _get(obj, key, defaultValue);
}

/**
 * Whether or not the Globus Transfer is enabled based on the state of the `static.json`.
 */
export const isTransferEnabled = Boolean(
  getAttribute(
    "features.transfer",
    getAttribute("components.Result.globus.transfer"),
  ),
);

/**
 * Whether or not a user can "Sign In" to the portal.
 * If Transfer functionality is enabled (`isTransferEnabled`), then authentication is enabled.
 */
export const isAuthenticationEnabled =
  isTransferEnabled || isFeatureEnabled("authentication");

export const areSEOResultsEnabled = isFeatureEnabled("seo_results");

export const METADATA = {
  title: getAttribute("metadata.title", "Search Portal"),
  description: getAttribute("metadata.description", ""),
};
