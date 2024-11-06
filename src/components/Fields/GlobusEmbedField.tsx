import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { ProcessedField } from "../Field";
import { isAuthorizationRequirementsError } from "@globus/sdk/core/errors";
import { useOAuthStore } from "@/store/oauth";
import { usePathname, useSearchParams } from "next/navigation";

const SUPPORTED_EXTENSIONS = {
  jpg: {
    mime: "image/jpeg",
  },
  jpeg: {
    mime: "image/jpeg",
  },
  png: {
    mime: "image/png",
  },
  gif: {
    mime: "image/gif",
  },
  tiff: {
    mime: "image/tiff",
  },
  svg: {
    mime: "image/svg+xml",
  },
  webp: {
    mime: "image/webp",
  },
  pdf: {
    mime: "application/pdf",
  },
  mp4: {
    mime: "video/mp4",
  },
};

type SupportedTypes = "image" | string;

type Config = {
  collection: string;
  path: string;
  type?: SupportedTypes;
  mime?: string;
  height?: string;
  width?: string;
};

export type Value = string | Config;

function isValidValue(value: unknown): value is Value {
  return (
    typeof value === "string" ||
    (typeof value === "object" &&
      value !== null &&
      "collection" in value &&
      "path" in value)
  );
}

function getExtension(path: string) {
  return path.split(".").pop()?.toLowerCase();
}

function getMimeType(path: string) {
  const extension = getExtension(path);
  return extension && SUPPORTED_EXTENSIONS[extension]?.mime;
}

export default function GlobusEmbedField({
  definition,
}: {
  definition: ProcessedField;
}) {
  const { value } = definition;

  return isValidValue(value) ? (
    <GlobusEmbed
      config={
        typeof value === "string"
          ? {
              path: value,
              ...definition.options,
            }
          : value
      }
    />
  ) : (
    <Text>Invalid value provided.</Text>
  );
}

function GlobusEmbed({ config }: { config: Config }) {
  const auth = useGlobusAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [src, setSrc] = useState<string | null>(null);

  const { width = "100%", height = "auto" } = config;

  useEffect(() => {
    async function attemptFetch() {
      setLoading(true);
      setError(false);
      setSrc(null);
      const result = await fetch(config.path, {
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
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      setSrc(url);
      setLoading(false);
    }

    attemptFetch();

    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [config]);

  return (
    <>
      <Box w={width} h={height}>
        {loading && (
          <Skeleton w={width} h={height}>
            Loading...
          </Skeleton>
        )}
        {error && <EmbedError error={error} rounded="md" />}
        {!error && src && (
          <>
            <Box
              w={width}
              h={height}
              border="1px solid"
              rounded="md"
              as="iframe"
              allow=""
              sandbox="allow-same-origin"
              referrerPolicy="no-referrer"
              srcDoc={`
              <object
                type="${getMimeType(config.path)}"
                data="${src}"
                width="${width}"
                height="${height}"
                style="font-size: 12px; font-family: sans-serif;"
              >
                <b>Unable to load preview of asset.</b>
                <div style="padding: .75em;">
                  <code>${config.path}</code>
                </div>
              </object>
            `}
            />
          </>
        )}
      </Box>
      <Box>
        <Button
          as="a"
          variant="link"
          colorScheme="black"
          href={config.path}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in New Tab
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
  return (
    <Alert status="error">
      <AlertIcon />
      {error?.message || "An error occurred."}
      <AlertDescription>
        {handler ? (
          <Button onClick={handler} size="xs" colorScheme="red" ml={2}>
            Address Error
          </Button>
        ) : (
          <Button onClick={() => console.error(error)} size="sm">
            Dismiss
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
