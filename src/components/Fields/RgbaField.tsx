import React from "react";
import { Box, Code, HStack } from "@chakra-ui/react";

type Value = (string | number)[];

function isValidValue(value: unknown): value is Value {
  return Array.isArray(value) && value.length >= 3;
}

/**
 * Render a field as an RGBA color.
 */
export default function RgbaField({ value }: { value: unknown }) {
  if (!isValidValue(value)) {
    return;
  }
  return (
    <HStack>
      <Box w="100px" h="100px" bg={`rgba(${value.join(",")})`} />
      <Code>{value.join(",")}</Code>
    </HStack>
  );
}
