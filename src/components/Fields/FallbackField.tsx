import React from "react";
import { Box, Code, Text } from "@chakra-ui/react";

type Value = unknown;

// function isValidValue(value: unknown): value is Value {
//   return true;
// }

/**
 * A fallback field that will introspect the value and render it as best as it can.
 */
export default function FallbackField({ value }: { value: Value }) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return <Text as="p">{value}</Text>;
  }
  if (Array.isArray(value)) {
    return value.map((v, i) => (
      <Box key={i}>
        <FallbackField value={v} />
      </Box>
    ));
  }
  return (
    <Code as="pre" display="block" borderRadius={2} my={1}>
      {JSON.stringify(value, null, 2)}
    </Code>
  );
}
