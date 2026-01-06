import React from "react";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { Icon } from "./private/Icon";
import { Sun, Moon } from "lucide-react";

/**
 * A color scheme toggle button that accounts for Next.js SSR
 * @see https://mantine.dev/theming/color-schemes/#color-scheme-value-caveats
 */
export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="subtle"
      color="primary"
      size="sm"
      aria-label="Toggle color scheme"
    >
      <Icon
        component={Sun}
        style={{ display: computedColorScheme === "light" ? "block" : "none" }}
      />
      <Icon
        component={Moon}
        style={{ display: computedColorScheme === "dark" ? "block" : "none" }}
      />
    </ActionIcon>
  );
}
