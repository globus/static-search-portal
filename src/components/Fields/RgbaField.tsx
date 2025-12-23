import React from "react";
import { Stack, Box, Code } from "@mantine/core";

type Value = (string | number)[];

function isValidValue(value: unknown): value is Value {
  return Array.isArray(value) && value.length >= 3;
}

/**
 * Render a field as an RGBA color.
 */
export default function RgbaField({
  value,
  size = "sm",
}: {
  value: unknown;
  size?: "sm" | "lg";
}) {
  if (!isValidValue(value)) {
    return;
  }

  const props = {
    h: size === "sm" ? "2.5rem" : "5rem",
    w: size === "sm" ? "2.5rem" : "5rem",
  };

  return (
    <Stack display="inline-flex">
      <Box bg={`rgba(${value.join(",")})`} {...props} />
      <Code>[{value.join(",")}]</Code>
    </Stack>
  );
}
