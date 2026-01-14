import { z } from "zod";
import { StaticSchema } from "./static";
import { ThemeSchema } from "@/theme";
import { ResultListingOptionsSchema } from "@/components/ResultListing";
import { ResultOptionsSchema } from "@/components/Result";
import { NavigationOptionsSchema } from "@/components/Navigation";

/**
 * The type used for `data` by the [@globus/static-search-portal generator](https://github.com/globus/static-search-portal).
 */
const DataSchema = z.object({
  /**
   * There is only one supported version for the `data` object at this time.
   */
  version: z.union([z.literal("1.0.0")]).default("1.0.0"),
  attributes: z
    .object({
      /**
       * Features that can be enabled or disabled in the portal.
       */
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
          authentication: z.boolean().optional().default(false),
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
      /**
       * The theme configuration for the portal.
       */
      theme: ThemeSchema.optional(),
      /**
       * Metadata for the portal, used in the HTML `<head>` section.
       */
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
      /**
       * The Content Security Policy (CSP) for the portal that will be included in a `<meta>` tag.
       * - If no value is provided, a default CSP will be used.
       * - If `false` is provided as the value, no CSP `<meta>` tag will be included.
       * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
       */
      contentSecurityPolicy: z.union([z.string(), z.literal(false)]).optional(),
      content: z
        .object({
          /**
           * The portal's main title.
           */
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
                type: z.enum(["terms"]).default("terms"),
              }),
            )
            .optional(),
        }),
      }),
    })
    .transform((attributes) => {
      return {
        ...attributes,
        features: {
          /**
           * If a Globus Auth client ID is provided, `authentication` is enabled by default.
           */
          authentication: Boolean(attributes?.globus?.application?.client_id),
          ...attributes.features,
        },
      };
    }),
});

export const GeneratorSchema = StaticSchema.extend({
  data: DataSchema,
});

export type GeneratorConfiguration = z.infer<typeof GeneratorSchema>;
export type GeneratorFeatures = keyof NonNullable<
  GeneratorConfiguration["data"]["attributes"]["features"]
>;
