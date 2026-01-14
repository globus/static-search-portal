import React, { useEffect, useRef } from "react";
import { Box } from "@mantine/core";
import { GlobusEmbedProps } from "../GlobusEmbedField";
import { useGCSAsset } from "@/hooks/useGlobusAPI";
/**
 * A Plotly renderer that can be used to render Plotly charts in a portal.
 * @see https://plotly.com/javascript/
 */
export function PlotlyRenderer(props: GlobusEmbedProps) {
  const asset = useGCSAsset({
    collection: props.config.collection,
    url: props.config.asset,
  });
  const landing = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function renderPlotly() {
      if (!landing.current || !asset.data) return;
      /**
       * We dynamically import Plotly in the renderer to ensure the library is only loaded
       * when a portal has opted to use the Plotly renderer.
       */
      const Plotly = (await import("plotly.js-dist-min")).default;
      let data: Parameters<typeof Plotly.newPlot>[1] = [];
      const content = await asset.data?.content;
      if (asset.data.type === "csv") {
        // @ts-expect-error @TODO
        const cells = content.columns.map((col: string) => {
          // @ts-expect-error @TODO
          return content.map((row: Record<string, unknown>) => row[col]);
        });
        data = [
          {
            type: "table",
            // @ts-expect-error `header` seems to be missing from the type definition, but is supported by Plotly.
            header: {
              // @ts-expect-error @TODO
              values: content.columns.map((col: string) => [col]),
              align: "center",
              line: { width: 1, color: "rgb(50, 50, 50)" },
              fill: { color: ["rgb(0, 0, 0)"] },
              font: { color: "white" },
            },
            cells: {
              values: cells,
            },
          },
        ];
      } else {
        data = content as unknown as Parameters<
          typeof import("plotly.js-dist-min").newPlot
        >[1];
      }
      Plotly.newPlot(landing.current, data);
    }
    renderPlotly();
  }, [asset.data]);

  return <Box ref={landing} />;
}
