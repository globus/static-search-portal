import React, { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";

/**
 * A Plotly renderer that can be used to render Plotly charts in a portal.
 * @see https://plotly.com/javascript/
 */
export function Plotly(
  props: {
    /**
     * The contents of the field that will be rendered as a Plotly chart.
     */
    contents: Record<string, unknown>;
  } & React.ComponentProps<typeof Box>,
) {
  const { contents, ...rest } = props;

  const landing = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function renderPlotly() {
      if (!landing.current) return;
      /**
       * We dynamically import Plotly in the renderer to ensure the library is only loaded
       * when a portal has opted to use the Plotly renderer.
       */
      const Plotly = (await import("plotly.js-dist-min")).default;
      Plotly.newPlot(
        landing.current,
        contents as unknown as Parameters<
          typeof import("plotly.js-dist-min").newPlot
        >[1],
      );
    }
    renderPlotly();
  });

  return <Box ref={landing} {...rest} />;
}
