import React from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const Icon = colorScheme === "light" ? MoonIcon : SunIcon;

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
      variant="subtle"
      color="primary"
      size="sm"
      aria-label="Toggle color scheme"
    >
      <Icon />
    </ActionIcon>
  );
}
