import React from "react";
import { Text, Tooltip } from "@chakra-ui/react";

type Value = string | number;

function isValidValue(value: unknown): value is Value {
  return typeof value === "string" || typeof value === "number";
}

export default function DateField({ value }: { value: unknown }) {
  if (!isValidValue(value)) {
    return;
  }
  return (
    <Tooltip label={value} variant="outline" placement="bottom-start">
      <Text _hover={{ cursor: "help" }}>
        {Intl.DateTimeFormat(undefined, {
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(value))}
      </Text>
    </Tooltip>
  );
}
