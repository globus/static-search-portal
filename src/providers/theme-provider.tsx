"use client";
import React from "react";
import theme from "../theme";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  );
}
