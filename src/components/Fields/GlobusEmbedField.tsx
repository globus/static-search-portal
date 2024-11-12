import React, { PropsWithChildren } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Code,
  Flex,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { ProcessedField } from "../Field";
import { isAuthorizationRequirementsError } from "@globus/sdk/core/errors";
import { useOAuthStore } from "@/store/oauth";
import { usePathname, useSearchParams } from "next/navigation";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { PlotlyRenderer } from "./Renderer/Plotly";
import { ObjectRenderer } from "./Renderer/Object";
import { useGCSAsset, useGCSAssetMetadata } from "@/hooks/useGlobusAPI";

type Renderers = "plotly" | "editor" | undefined;

type SharedOptions = {
  /**
   * The Globus Collection that the asset is hosted on. This is required
   * to ensure the proper Authorization header is sent with the request.
   */
  collection: string;
  /**
   * When using the default renderer, the MIME type of the `<object>` can be
   * specified using this option. If not provided, the MIME type will be
   * inferred from the "Content-Type" header in the asset response.
   */
  mime?: string;
  /**
   * The renderer that will be used to display the asset. By default,
   * the asset will be rendered as an `<object>` in a sandboxed `<iframe>`.
   *
   * - `plotly` will render the asset as a Plotly chart. When using this renderer, the asset should be a JSON file than can
   * be passed as the configuration object for your chart; See https://plotly.com/javascript/plotlyjs-function-reference/#plotlynewplot) for more details.
   */
  renderer?: Renderers;

  /**
   * Sytling options for the rendered asset, such as width and height.
   * The configured `renderer` will determine how these options are applied.
   */

  height?: string;
  width?: string;
};

export type Definition =
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

export type GlobusEmbedProps = PropsWithChildren<{
  field: ProcessedField;
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
      field,
      config: {
        asset: derivedValue,
        collection: field.options.collection,
        ...field.options,
      },
    };
  }

  if (typeof derivedValue === "object") {
    props = {
      field,
      /**
       * If the derived value is an object, assume it is a valid configuration object.
       */
      config: derivedValue as GlobusEmbedProps["config"],
    };
  }
  return props && <GlobusEmbed {...props} />;
}

function GlobusEmbed({ config, field }: GlobusEmbedProps) {
  const metadata = useGCSAssetMetadata({
    collection: config.collection,
    url: config.asset,
  });

  const asset = useGCSAsset({
    collection: config.collection,
    url: config.asset,
    mimeTypeHint: config.mime || metadata.data?.contentType,
    enabled: metadata.isFetched,
  });

  const { width = "100%", height = "auto" } = config;

  const renderer = config.renderer || asset.data?.renderer;
  const Renderer = renderer === "plotly" ? PlotlyRenderer : ObjectRenderer;

  return (
    <>
      <Box w={`calc(${width} + 2em)`} h={`calc(${height} + 2em)`}>
        {metadata.isLoading && (
          <Center>
            <HStack>
              <Spinner size="sm" mr={1} />
              <Text fontSize="sm">Fetching asset metadata...</Text>
            </HStack>
          </Center>
        )}

        {asset.isLoading && (
          <Center>
            <HStack>
              <Spinner size="sm" mr={1} />
              <Text fontSize="sm">Fetching asset...</Text>
            </HStack>
          </Center>
        )}
        {asset.isError && <EmbedError error={asset.error} />}
        {!asset.isError && asset.isFetched && (
          <Renderer field={field} config={config} />
        )}
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
          Open in New Tab <ExternalLinkIcon mx="2px" />
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
