import { useEffect, useState } from "react";
import { Paper } from "@mantine/core";
import { GlobusEmbedProps } from "../GlobusEmbedField";
import { useGCSAsset } from "@/hooks/useGlobusAPI";

/**
 * The default renderer for assets.
 * This renderer will render the asset as an `<object>` in a sandboxed `<iframe>`.
 */
export function ObjectRenderer(props: GlobusEmbedProps) {
  const { config, field } = props;
  const { width = "100%", height = "auto" } = config;

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
      if (!contents || !(contents instanceof Blob)) return;
      setType(asset.data?.contentType ?? undefined);
      const url = URL.createObjectURL(contents);
      setObjectURL(url);
    }
    renderAsset();
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [asset.data]);

  return (
    objectUrl &&
    type && (
      <Paper
        w={`calc(${width} + 2em)`}
        h={`calc(${height} + 2em)`}
        withBorder
        p="xs"
        component="iframe"
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
