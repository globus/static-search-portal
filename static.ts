import _STATIC from "./static.json";
import { get } from "lodash";

import type { GMetaResult } from "static-search/pages";

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
    metadata: {
      title: string;
      description: string;
    };
    content: {
      headline: string;
      logo?: {
        src: string;
        alt?: string;
      };
    };
    /**
     * The result object is used to determine how the portal will render the search results.
     * - All fields are optional, but recommended for a better user experience.
     * - Values are expected to be paths to the desired field in the Globus `GMetaResult` object.
     *
     * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
     */
    result?: {
      /**
       * The field to use as the identifier for the result.
       * This field is used to generate the URL for the result (e.g., `/results/:identifier`).
       * @default "subject"
       */
      identifier?: string;
      /**
       * The field to use as the title for the result.
       * @default "subject"
       * @example "entries[0].content.title"
       */
      title?: string;
      /**
       * The field to use as the summary for the result.
       * @example "entries[0].content.summary"
       */
      summary?: string;
    };
    globus: {
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
      };
      /**
       * Configuration for Search-related functionality in the portal.
       */
      search: {
        /**
         * The UUID of the Globus Search Index that will be used as the data source.
         */
        index: string;
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

const {
  data: { attributes },
} = STATIC;

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

const FIELD_LOOKUPS = {
  result: {
    identifier:
      STATIC.data.attributes.result &&
      "identifier" in STATIC.data.attributes.result
        ? STATIC.data.attributes.result.identifier
        : "subject",
    title:
      STATIC.data.attributes.result && "title" in STATIC.data.attributes.result
        ? STATIC.data.attributes.result.title
        : "subject",
    summary:
      STATIC.data.attributes.result &&
      "summary" in STATIC.data.attributes.result
        ? STATIC.data.attributes.result.summary
        : null,
  },
};

export function getStaticField(result: GMetaResult, field: string) {
  return get(result, get(FIELD_LOOKUPS, field));
}
