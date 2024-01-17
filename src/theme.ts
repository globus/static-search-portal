import { extendTheme } from "@chakra-ui/react";

import "@fontsource/ibm-plex-mono";
import "@fontsource/ibm-plex-sans";

const theme = extendTheme({
  fonts: {
    heading: `'IBM Plex Sans', sans-serif`,
    body: `'IBM Plex Sans', sans-serif`,
    mono: `'IBM Plex Mono', monospace`,
  },
  colors: {
    brand: {
      "50": "#E5F2FF",
      "100": "#B8DBFF",
      "200": "#8AC4FF",
      "300": "#5CADFF",
      "400": "#2E96FF",
      "500": "#007FFF",
      "600": "#0066CC",
      "700": "#004C99",
      "800": "#00264c",
      "900": "#001933",
    },
  },
});

export default theme;
