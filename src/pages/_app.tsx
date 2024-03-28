// pages/_app.js
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
