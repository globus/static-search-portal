import React from "react";
import { Text, Tooltip } from "@mantine/core";

type Value = string | number;

function isValidValue(value: unknown): value is Value {
  return typeof value === "string" || typeof value === "number";
}

export default function DateField({ value }: { value: unknown }) {
  if (!isValidValue(value)) {
    return;
  }
  return (
    <Tooltip label={value}>
      <Text>
        {Intl.DateTimeFormat(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(value))}
      </Text>
    </Tooltip>
  );
}
