import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { GlobusEmbedProps } from "../GlobusEmbedField";
import { useGCSAsset } from "@/hooks/useGlobusAPI";

/**
 * The default renderer for assets.
 * This renderer will render the asset as an `<object>` in a sandboxed `<iframe>`.
 */
export function ObjectRenderer(props: GlobusEmbedProps) {
  const { config, field } = props;
  const { width = "100%", height = "auto" } = config;

  const [blob, setBlob] = useState<Blob>();
  const [objectUrl, setObjectURL] = useState<string>();
  const [type, setType] = useState<string | undefined>(config.mime);

  const asset = useGCSAsset({
    collection: config.collection,
    url: config.asset,
  });

  useEffect(() => {
    async function renderAsset() {
      if (!asset.data) return;
      const contents = await asset.data?.content;
      setBlob(contents);
      setType(asset.data?.contentType ?? undefined);
    }
    renderAsset();
  }, [asset.data]);

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setObjectURL(url);
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [blob]);

  return (
    objectUrl &&
    type && (
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
        type="${type}"
        data="${objectUrl}"
        width="${width}"
        height="${height}"
        style="font-size: 12px; font-family: sans-serif;"
      >
        <b>Unable to load preview of asset.</b>
        <div style="padding: .75em;">
          <code>${JSON.stringify(field, null, 2)}</code>
        </div>
      </object>
    `}
      />
    )
  );
}
