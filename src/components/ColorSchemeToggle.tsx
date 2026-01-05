import React from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "lucide-react";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const Icon = colorScheme === "light" ? Moon : Sun;

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
