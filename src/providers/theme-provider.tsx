"use client";
import theme from "@/theme";

import { MantineProvider, type MantineProviderProps } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export function ThemeProvider({ children, ...props }: MantineProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light" {...props}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
