import { useQuery } from "@tanstack/react-query";
import { transfer, search } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { type AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

import { STATIC } from "../../static";
import type { Renderers } from "@/components/Fields/GlobusEmbedField";

async function fetchCollection(
  authorization: AuthorizationManager | undefined,
  id: string,
) {
  const response = await transfer.endpoint.get(
    id,
    {},
    { manager: authorization },
  );
  return response.json();
}

export function useCollection(collectionId: string) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth?.isAuthenticated,
    queryKey: ["transfer", "collections", collectionId],
    queryFn: () => fetchCollection(auth.authorization, collectionId),
  });
}

async function fetchSubject(
  authorization: AuthorizationManager | undefined,
  subject: string,
) {
  const response = await search.subject.get(
    STATIC.data.attributes.globus.search.index,
    {
      query: {
        subject,
      },
    },
    { manager: authorization },
  );
  return response.json();
}

export function useSubject(id: string) {
  const auth = useGlobusAuth();
  /**
   * If the user is authenticated, we store that result under a different key.
   */
  const key = ["search"];
  if (auth?.isAuthenticated) {
    key.push("authenticated");
  }
  key.push("subjects", id);
  return useQuery({
    queryKey: key,
    queryFn: () => fetchSubject(auth?.authorization, id),
  });
}

export function useStat(collectionId: string, path: string) {
  const auth = useGlobusAuth();
  const key = ["transfer", "collections", collectionId, "stat", path];
  return useQuery({
    enabled: auth?.isAuthenticated,
    queryKey: key,
    queryFn: async () => {
      const response = await transfer.fileOperations.stat(
        collectionId,
        {
          query: {
            path,
          },
        },
        { manager: auth.authorization },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    },
  });
}

export function useGCSAssetMetadata({
  collection,
  url,
}: {
  collection: string;
  url: string;
}) {
  const auth = useGlobusAuth();

  const token =
    auth.authorization?.tokens.getByResourceServer(collection)?.access_token;
  return useQuery({
    enabled: !!auth.isAuthenticated,
    queryKey: ["gcs", url, "metadata"],
    queryFn: async () => {
      const response = await fetch(url, {
        method: "HEAD",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Unable to fetch asset metadata.");
      }
      return {
        contentType: response.headers.get("Content-Type"),
        contentLength: parseInt(response.headers.get("Content-Length") || "0"),
      };
    },
  });
}

type GCSAssetResponse = {
  /**
   * The application-internal type we use to determine how to render the asset.
   */
  type: "json" | "blob" | "csv";
  /**
   * `renderer` that should be used to render the asset based on the observed Content-Type and user-provided `mime` type.
   * During actual rendering a user-provided `renderer` should take precedence over the inferred `renderer`.
   */
  renderer?: Renderers;
  content: Promise<unknown>;
  /**
   * The `mime` type of the asset set by the user or inferred `mime` type based on the asset response.
   */
  mime: string | null;
  /**
   * The `Content-Type` header from the asset response.
   */
  contentType: string | null;
};

export function useGCSAsset({
  collection,
  url,
  enabled,
  mimeTypeHint,
}: {
  collection: string;
  url: string;
  enabled?: boolean;
  mimeTypeHint?: string | null;
}) {
  const auth = useGlobusAuth();
  const token =
    auth.authorization?.tokens.getByResourceServer(collection)?.access_token;

  return useQuery({
    enabled: !!auth.isAuthenticated && enabled !== false,
    queryKey: ["gcs", url],
    queryFn: async (): Promise<GCSAssetResponse> => {
      let contentType = mimeTypeHint;

      if (!mimeTypeHint) {
        /**
         * If we don't have a `mimeTypeHint`, we try to do a `HEAD` request to the
         * asset as a way to determine the content type.
         */
        const response = await fetch(url, {
          method: "HEAD",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          contentType = response.headers.get("Content-Type");
        }
      }
      /**
       * At this point, the `contentType` is either the user-provided `mime` or the
       * `Content-Type` value from the `HEAD` request.
       */
      if (contentType?.includes("text/csv")) {
        /**
         * If we detect a CSV file, we use `d3-fetch` to fetch and parse the asset.
         */
        const d3Fetch = await import("d3-fetch");
        return {
          type: "csv",
          content: d3Fetch.csv(url, {
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              Authorization: `Bearer ${token}`,
            },
          }),
          /**
           * We'll use the `plotly` renderer to render the CSV data as a table.
           */
          renderer: "plotly",
          mime: mimeTypeHint ?? null,
          contentType,
        };
      }

      /**
       * For all other content types, we'll fetch the asset and return
       * and return the body function reference to the content based on
       * the observed content type.
       */
      const response = await fetch(url, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${token}`,
        },
      });
      contentType = response.headers.get("Content-Type");
      if (!response.ok) {
        return Promise.reject(
          /**
           * Errors might come from GridFTP, so we need to detect whether or
           * not the response is JSON or text before throwing an error.
           */
          contentType?.includes("application/json")
            ? await response.json()
            : await response.text(),
        );
      }
      if (contentType?.includes("application/json")) {
        return {
          type: "json",
          content: response.json(),
          mime: contentType,
          contentType,
          renderer: "json",
        };
      }
      return {
        type: "blob",
        content: response.blob(),
        mime: contentType,
        contentType,
      };
    },
  });
}
