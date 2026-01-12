import _STATIC from "./static.json" assert { type: "json" };
import { z } from "zod";
import { get as _get } from "lodash";
import { ThemeSchema } from "@/theme";

import { ResultListingOptionsSchema } from "@/components/ResultListing";
import { ResultOptionsSchema } from "@/components/Result";
import { NavigationOptionsSchema } from "@/components/Navigation";

const Static = z.object({
  _static: z.object({
    generator: z.object({
      name: z.string(),
    }),
    host: z
      .object({
        base_url: z.string(),
        origin: z.string(),
        host: z.string(),
        base_path: z.string(),
      })
      .optional(),
  }),
  data: z.object({
    /**
     * The version of the `data` object, which is used to determine how
     * the generator will render its `attributes`.
     * @example "1.0.0"
     */
    version: z.string(),
    attributes: z.object(),
  }),
});

/**
 * The type used for `data` by the [@globus/static-search-portal generator](https://github.com/globus/static-search-portal).
 */
const Data = z.object({
  version: z.union([z.literal("1.0.0")]).default("1.0.0"),
  attributes: z.object({
    features: z
      .object({
        /**
         * Enable JSONata support for processing the `static.json` file.
         * @see https://jsonata.org/
         */
        jsonata: z.boolean().optional().default(false),
        /**
         * Enable the Globus Auth functionality in the portal.
         */
        authentication: z
          .boolean()
          .optional()
          /**
           * If a Globus Auth client ID is provided, `authentication` is enabled by default.
           */
          .default(
            Boolean(_STATIC.data.attributes?.globus?.application?.client_id),
          ),
        /**
         * Force users to authenticate before accessing the portal, regardless of whether or not the
         * configured Globus Index is private.
         */
        requireAuthentication: z.boolean().optional().default(false),
        /**
         * Enables the Globus Transfer functionality in the portal.
         */
        transfer: z.boolean().optional().default(false),
        /**
         * Whether or not authorization data should be stored in LocalStorage
         */
        useLocalStorage: z.boolean().optional().default(false),
        /**
         * Enable SEO results in the portal; This feature is not yet available.
         * @private
         */
        seoResults: z.boolean().optional().default(false),
      })
      .optional(),
    theme: ThemeSchema.optional(),
    metadata: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
      })
      .optional(),
    /**
     * The Content Security Policy (CSP) for the portal that will be included in a `<meta>` tag.
     * If no value is provided, a default CSP will be used.
     * If `false` is provided as the value, no CSP `<meta>` tag will be included.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
     */
    contentSecurityPolicy: z.union([z.string(), z.literal(false)]).optional(),
    content: z
      .object({
        headline: z.string().optional(),
        /**
         * The URL of the portal's header image.
         */
        image: z.string().optional(),
        logo: z
          .object({
            src: z.string(),
            alt: z.string().optional(),
          })
          .optional(),
        navigation: NavigationOptionsSchema.optional(),
      })
      .optional(),
    components: z
      .object({
        Result: ResultOptionsSchema.optional(),
        ResultListing: ResultListingOptionsSchema.optional(),
        Navigation: NavigationOptionsSchema.optional(),
      })
      .optional()
      .transform((obj) => {
        return {
          ...obj,
          Result: {
            heading: obj?.ResultListing?.heading || "subject",
            summary: obj?.ResultListing?.summary || undefined,
            ...obj?.Result,
          },
          ResultListing: {
            heading: obj?.Result?.heading || "subject",
            summary: obj?.Result?.summary || undefined,
            ...obj?.ResultListing,
          },
        };
      }),
    globus: z.object({
      /**
       * The Globus platform environment.
       * @private
       */
      environment: z.string().optional(),
      /**
       * Information about your registered Globus Auth Application (Client)
       * @see https://docs.globus.org/api/auth/developer-guide/#developing-apps
       */
      application: z
        .object({
          /**
           * The UUID of the client application.
           */
          client_id: z.string(),
          /**
           * The redirect URI for the Globus Auth login page to complete the OAuth2 flow.
           * The portal will make a reasonable effort to determine this URI, but this field is provided as a fallback.
           * To use the portal's built-in authorization handling, redirects should be sent to `/authenticate` on the host.
           * @example "https://example.com/data-portal/authenticate"
           */
          redirect_uri: z.string().optional(),
          /**
           * Additional scopes to request from the Globus Auth service when authenticating.
           */
          scopes: z.array(z.string()).optional(),
        })
        .optional(),
      search: z.object({
        /**
         * Configuration for Search-related functionality in the portal.
         */
        index: z.string(),
        /**
         * The UUID of the Globus Search Index that will be used as the data source.
         */
        facets: z
          .array(
            z.object({
              name: z.string().optional(),
              field_name: z.string(),
              type: z.string().optional(),
            }),
          )
          .optional(),
      }),
    }),
  }),
});

export type Static = z.infer<typeof Static> & {
  data: z.infer<typeof Data>;
};

const GeneratorSchema = Static.extend({
  data: Data,
});

const result = GeneratorSchema.safeParse(_STATIC);

if (result.error) {
  z.prettifyError(result.error);
}

/**
 * Reference to the `static.json` file.
 * @private
 */
export const STATIC = GeneratorSchema.parse(_STATIC);

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
   * The fallback here is mostly to accoun`t` for SSR.
   * @todo This could likely be configured to get `basePath` and host information for the Next.js configuration or environment.
   */
  const baseURL = globalThis.location
    ? `${globalThis.location.protocol}//${globalThis.location.host}`
    : "";
  return `${baseURL}/authenticate`;
}

type Features = keyof NonNullable<
  z.infer<typeof Data>["attributes"]["features"]
>;

/**
 * Whether or not a feature is enabled in the `static.json`.
 * @private
 */
export function isFeatureEnabled(key: Features, defaultValue?: boolean) {
  return Boolean(attributes.features?.[key] ?? defaultValue);
}
/**
 * @private
 */
export function withFeature<T>(
  key: Features,
  a: () => T,
  b: () => T | null = () => null,
) {
  return isFeatureEnabled(key) ? a() : b();
}

/**
 * Whether or not the Globus Transfer is enabled based on the state of the `static.json`.
 */
export const isTransferEnabled = Boolean(
  isFeatureEnabled("transfer") ||
    attributes.components?.Result?.globus?.transfer,
);

/**
 * Whether or not a user can "Sign In" to the portal.
 * If Transfer functionality is enabled (`isTransferEnabled`), then authentication is enabled.
 */
export const isAuthenticationEnabled =
  isTransferEnabled || isFeatureEnabled("authentication");

export const areSEOResultsEnabled = isFeatureEnabled("seoResults");

export const METADATA = {
  title: attributes.metadata?.title || "Search Portal",
  description: attributes.metadata?.description || "",
};

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
  const resolvedKey = _get(STATIC.data.attributes, key);
  if (typeof resolvedKey !== "string") {
    return defaultValue;
  }
  return await getValueFrom<T>(obj, resolvedKey, defaultValue);
}

export async function getValueFrom<T>(
  obj: Record<string, unknown>,
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
  if (!key || obj === null || obj === undefined) {
    return defaultValue;
  }
  return _get(obj, key, defaultValue);
}
