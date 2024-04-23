import React, { useEffect } from "react";
import { get } from "lodash";
import { Heading, Box, HStack } from "@chakra-ui/react";
import jsonata from "jsonata";

import RgbaField from "./Fields/RgbaField";
import ImageField from "./Fields/ImageField";
import TableField from "./Fields/TableField";
import FallbackField from "./Fields/FallbackField";

import type { GMetaResult } from "../globus/search";
import { isFeatureEnabled } from "../../static";

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

export type ProcessedField = {
  label: string | undefined;
  value: unknown;
  type: string | undefined;
};

export async function getProcessedField(
  field: FieldDefinition,
  data: GMetaResult,
): Promise<ProcessedField> {
  /**
   * Ensure we're working with a FieldDefinition object.
   */
  const def = typeof field === "string" ? { property: field } : field;
  let value;
  if ("value" in def) {
    value = def.value;
  } else {
    if (isFeatureEnabled("jsonata")) {
      const expression = jsonata(def.property);
      value = await expression.evaluate(data);
    } else {
      value = get(data, def.property);
    }
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
  if (type === "table") {
    return <TableField value={value} />;
  }
  /**
   * If no `type` is provided, or the `type` is not recognized, use the fallback field.
   */
  return <FallbackField value={value} />;
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
  const [processedField, setProcessedField] = React.useState<ProcessedField>();

  useEffect(() => {
    getProcessedField(field, gmeta).then((result) => {
      setProcessedField(result);
    });
  }, [field, gmeta]);

  if (!processedField) {
    return null;
  }

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
