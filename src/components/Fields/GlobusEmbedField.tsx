import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Code,
  Flex,
  Skeleton,
} from "@chakra-ui/react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { ProcessedField } from "../Field";
import { isAuthorizationRequirementsError } from "@globus/sdk/core/errors";
import { useOAuthStore } from "@/store/oauth";
import { usePathname, useSearchParams } from "next/navigation";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { JSONTree } from "../JSONTree";
import { Plotly } from "./Renderer/Plotly";

type Renderers = "plotly" | undefined;

type SharedOptions = {
  /**
   * The Globus Collection that the asset is hosted on. This is required
   * to ensure the proper Authorization header is sent with the request.
   */
  collection: string;
  /**
   * When using the default renderer, the MIME type of the `<object>` can be
   * specified using this option. If not provided, the MIME type will be
   * inferred from the file extension.
   */
  mime?: string;
  /**
   * The renderer that will be used to display the asset. By default,
   * the asset will be rendered as an `<object>` in a sandboxed `<iframe>`.
   */
  renderer?: Renderers;

  /**
   * Sytling options for the rendered asset, such as width and height.
   * The configured `renderer` will determine how these options are applied.
   */

  height?: string;
  width?: string;
};

type Definition =
  | {
      label: string;
      property: string;
      type: "globus.embed";
      options: {
        /**
         * The full HTTPS URL to the asset.
         */
        asset?: string;
        /**
         * The path to the asset on the Globus Collection. This can be used as
         * an alternative to the `asset` field.
         */
        path?: string;
      } & SharedOptions;
    }
  | {
      label: string;
      type: "globus.embed";
      value: string;
      options: {
        /**
         * The full HTTPS URL to the asset.
         */
        asset?: string;
        /**
         * The path to the asset on the Globus Collection. This can be used as
         * an alternative to the `asset` field.
         */
        path?: string;
      } & SharedOptions;
    }
  | {
      label: string;
      type: "globus.embed";
      options: (
        | {
            /**
             * The full HTTPS URL to the asset.
             */
            asset: string;
          }
        | {
            /**
             * The path to the asset on the Globus Collection. This can be used as
             * an alternative to the `asset` field.
             */
            path: string;
          }
      ) &
        SharedOptions;
    };

export type Value = string | Definition["options"];

function isValidValue(value: unknown): value is Value {
  return (
    typeof value === "string" ||
    (typeof value === "object" &&
      value !== null &&
      "collection" in value &&
      ("asset" in value || "path" in value))
  );
}

type GlobusEmbedProps = PropsWithChildren<{
  config: Definition["options"] & {
    asset: string;
  };
}>;

export default function GlobusEmbedField({ field }: { field: ProcessedField }) {
  const { derivedValue } = field;
  if (!isValidValue(derivedValue)) {
    return (
      <Alert status="error" flexDirection="column" alignItems="flex-start">
        <Flex>
          <AlertIcon />
          <AlertTitle>Unable to render Globus-embedded asset.</AlertTitle>
        </Flex>
        <AlertDescription w="100%">
          <details>
            Unable to interpret the provided configuration as a valid
            Globus-embedded asset.
            <Code as="pre" overflow="scroll" maxW="100%">
              {JSON.stringify(field, null, 2)}
            </Code>
          </details>
        </AlertDescription>
      </Alert>
    );
  }
  let props: GlobusEmbedProps | undefined;
  if (
    typeof derivedValue === "string" &&
    field.options?.collection &&
    typeof field.options?.collection === "string"
  ) {
    props = {
      config: {
        asset: derivedValue,
        collection: field.options.collection,
        ...field.options,
      },
    };
  }

  if (typeof derivedValue === "object") {
    props = {
      /**
       * If the derived value is an object, assume it is a valid configuration object.
       */
      config: derivedValue as GlobusEmbedProps["config"],
    };
  }
  return props && <GlobusEmbed {...props} />;
}

function GlobusEmbed({ config }: GlobusEmbedProps) {
  const auth = useGlobusAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | false>(false);
  const [contents, setContents] = useState<{
    url?: string;
    json?: Record<string, unknown>;
  } | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);

  const { width = "100%", height = "auto", mime } = config;

  useEffect(() => {
    async function attemptFetch() {
      setLoading(true);
      setError(false);
      setContents(null);
      const result = await fetch(config.asset, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${auth.authorization?.tokens.getByResourceServer(config.collection)?.access_token}`,
        },
      });
      if (!result.ok) {
        setError(await result.json());
        setLoading(false);
        return;
      }
      const contentType = result.headers.get("Content-Type");
      const isJSON = contentType?.includes("application/json");
      setContentType(contentType);
      if (isJSON) {
        try {
          const json = await result.json();
          setContents({ json });
        } catch (e) {
          setError(e);
        }
      } else {
        const blob = await result.blob();
        const url = URL.createObjectURL(blob);
        setContents({ url });
      }
      setLoading(false);
    }

    attemptFetch();

    return () => {
      if (contents && contents.url) {
        URL.revokeObjectURL(contents.url);
      }
    };
  }, [config]);

  return (
    <>
      <Box w={`calc(${width} + 2em)`} h={`calc(${height} + 2em)`}>
        {loading && (
          <Skeleton w={`calc(${width} + 2em)`} h={`calc(${height} + 2em)`}>
            Loading...
          </Skeleton>
        )}
        {error !== false && <EmbedError error={error} />}
        {!error && contents?.url && (
          <Box
            w={`calc(${width} + 2em)`}
            h={`calc(${height} + 2em)`}
            p={1}
            border="1px solid"
            rounded="md"
            as="iframe"
            allow=""
            sandbox="allow-same-origin"
            referrerPolicy="no-referrer"
            srcDoc={`
              <object
                type="${mime || contentType}"
                data="${contents.url}"
                width="${width}"
                height="${height}"
                style="font-size: 12px; font-family: sans-serif;"
              >
                <b>Unable to load preview of asset.</b>
                <div style="padding: .75em;">
                  <code>${config.asset}</code>
                </div>
              </object>
            `}
          />
        )}
        {!error &&
          contents?.json &&
          (config.renderer === "plotly" ? (
            <Plotly contents={contents.json} />
          ) : (
            <JSONTree data={contents.json} />
          ))}
      </Box>
      <Box>
        <Button
          as="a"
          variant="link"
          colorScheme="black"
          href={config.asset}
          target="_blank"
          rel="noopener noreferrer"
          size="xs"
        >
          Open {contents?.json ? "JSON " : ""} in New Tab{" "}
          <ExternalLinkIcon mx="2px" />
        </Button>
      </Box>
    </>
  );
}

function EmbedError({ error }: { error: unknown }) {
  const auth = useGlobusAuth();
  const oauthStore = useOAuthStore();
  const pathname = usePathname();
  const search = useSearchParams();
  let handler;
  if (isAuthorizationRequirementsError(error)) {
    const requiredScopes = error.authorization_parameters?.required_scopes;
    handler = async () => {
      oauthStore.setReplaceWith(`${pathname}${search ? `?${search}` : ""}`);
      await auth.authorization?.handleAuthorizationRequirementsError(error, {
        additionalParams: {
          /**
           * @todo The current SDK does not account for passing this `scope` parameter while using
           * the in-memory token storage – this will be addressed in a future release.
           */
          scope: `${(requiredScopes || []).join(" ")} ${auth.authorization.configuration.scopes}`,
        },
      });
    };
  }
  /**
   * Attempt to extract a `message` from the error.
   */
  const message =
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "An error occurred.";
  return (
    <Alert status="error">
      <AlertIcon />
      {message}
      <AlertDescription>
        {handler && (
          <Button onClick={handler} size="xs" colorScheme="red" ml={2}>
            Address Error
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
