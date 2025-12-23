"use client";
import React from "react";
import theme from "../theme";

import { MantineProvider } from "@mantine/core";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
