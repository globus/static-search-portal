import React from "react";
import { Text, Tooltip } from "@chakra-ui/react";
import { readableBytes } from "@globus/sdk/services/transfer/utils";

type Value = string | number;

function isValidValue(value: unknown): value is Value {
  return typeof value === "string" || typeof value === "number";
}

export default function BytesField({ value }: { value: unknown }) {
  if (!isValidValue(value)) {
    return;
  }
  const asInt = typeof value === "string" ? parseInt(value) : value;
  return (
    <Tooltip
      label={`${asInt} bytes`}
      variant="outline"
      placement="bottom-start"
    >
      <Text>{readableBytes(asInt)}</Text>
    </Tooltip>
  );
}
