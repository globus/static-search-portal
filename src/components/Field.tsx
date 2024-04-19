import React from "react";
import { get } from "lodash";
import { Heading, Box, HStack } from "@chakra-ui/react";

import RgbaField from "./Fields/RgbaField";
import ImageField from "./Fields/ImageField";
import FallbackField from "./Fields/FallbackField";

import type { GMetaResult } from "../globus/search";

export type FieldDefinition =
  | string
  | {
      label: string;
      property: string;
      type?: string;
    }
  | {
      label: string;
      value: unknown;
      type?: string;
    };

type ProcessedField = {
  label: string | undefined;
  value: unknown;
  type: string | undefined;
};

export function getProcessedField(
  field: FieldDefinition,
  data: GMetaResult,
): ProcessedField {
  /**
   * Ensure we're working with a FieldDefinition object.
   */
  const def = typeof field === "string" ? { property: field } : field;
  let value;
  if ("value" in def) {
    value = def.value;
  } else {
    value = get(data, def.property);
  }
  return {
    label: undefined,
    type: undefined,
    value,
    ...def,
  };
}

export const FieldValue = ({
  value,
  type,
}: {
  value: unknown;
  type?: string;
}) => {
  if (type === "rgba") {
    return <RgbaField value={value} />;
  }
  if (type === "image") {
    return <ImageField value={value} />;
  }
  return <FallbackField value={value} />; // fallback
};

export const Field = ({
  field,
  gmeta,
  condensed,
}: {
  field: FieldDefinition;
  gmeta: GMetaResult;
  condensed?: boolean;
}) => {
  const processedField = getProcessedField(field, gmeta);
  if (condensed) {
    return (
      <HStack>
        {processedField.label && (
          <Heading as="h2" size="sm" my={2}>
            {processedField.label}
          </Heading>
        )}
        <FieldValue value={processedField.value} type={processedField.type} />
      </HStack>
    );
  }

  return (
    <Box my="2">
      {processedField.label && (
        <Heading as="h2" size="sm" my={2}>
          {processedField.label}
        </Heading>
      )}
      <FieldValue value={processedField.value} type={processedField.type} />
    </Box>
  );
};
