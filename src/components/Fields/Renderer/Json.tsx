import React, { useEffect, useState } from "react";
import { GlobusEmbedProps } from "../GlobusEmbedField";
import { useGCSAsset } from "@/hooks/useGlobusAPI";
import { JSONTree } from "@/components/JSONTree";

/**
 * Render JSON data.
 */
export function JsonRenderer(props: GlobusEmbedProps) {
  const { config } = props;
  // const { width = "100%", height = "auto" } = config;

  const [value, setValue] = useState<unknown>();

  const asset = useGCSAsset({
    collection: config.collection,
    url: config.asset,
  });

  useEffect(() => {
    async function renderAsset() {
      if (asset.data) {
        setValue(await asset.data?.content);
      }
    }
    renderAsset();
  }, [asset.data]);

  return <JSONTree data={value} />;
}
