import React from "react";
import { Text } from "@mantine/core";
import { JSONTree } from "../JSONTree";

type Value = unknown;

/**
 * A fallback field that will introspect the value and render it as best as it can.
 */
export default function FallbackField({ value }: { value: Value }) {
  if (value === null || value === undefined) {
    return <Text>&mdash;</Text>;
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return <Text>{String(value)}</Text>;
  }
  if (Array.isArray(value)) {
    return value.map((v, i) => <FallbackField key={i} value={v} />);
  }
  return <JSONTree data={value} />;
}
