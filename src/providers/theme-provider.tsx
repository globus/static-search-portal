"use client";
import React from "react";
import theme from "../theme";

import { ChakraProvider } from "@chakra-ui/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
