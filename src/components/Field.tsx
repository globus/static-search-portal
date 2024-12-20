import React, { useEffect } from "react";
import { get } from "lodash";
import { Heading, Box } from "@chakra-ui/react";
import jsonata from "jsonata";

import GlobusEmbedField from "./Fields/GlobusEmbedField";
import RgbaField from "./Fields/RgbaField";
import ImageField from "./Fields/ImageField";
import TableField from "./Fields/TableField";
import LinkField from "./Fields/LinkField";
import DateField from "./Fields/DateField";
import BytesField from "./Fields/BytesField";
import FallbackField from "./Fields/FallbackField";

import { GMetaResult } from "@globus/sdk/services/search/service/query";
import { isFeatureEnabled } from "../../static";

type SharedDefinitionProperties = {
  /**
   * The label for the field.
   */
  label?: string;
  /**
   * An option `type` to specify how the field should be rendered.
   */
  type?: string;
  options?: Record<string, unknown>;
};

export type FieldDefinition =
  /**
   * When a string value is provided, it is assumed to be equivalent to a `property` definition.
   */
  | string
  | ({
      /**
       * When `property` it is assumed to be a pointer to a property on the object currently being processed/displayed.
       */
      property: string;
    } & SharedDefinitionProperties)
  | ({
      value: unknown;
    } & SharedDefinitionProperties);

/**
 * The processed field object is the result of processing a `FieldDefinition` object to a more standard/predictable object.
 */
export type ProcessedField = {
  /**
   * The derived `value` of either the original provided `value` or the result of the `property` lookup.
   */
  derivedValue: unknown;
} & SharedDefinitionProperties;

/**
 * Get the processed field object from a `FieldDefinition` object and a `GMetaResult` object.
 */
export async function getProcessedField(
  field: FieldDefinition,
  data: GMetaResult,
): Promise<ProcessedField> {
  /**
   * Ensure we're working with a FieldDefinition object.
   */
  const def = typeof field === "string" ? { property: field } : field;
  let derivedValue;
  if ("value" in def) {
    derivedValue = def.value;
  } else {
    if (isFeatureEnabled("jsonata")) {
      const expression = jsonata(def.property);
      derivedValue = await expression.evaluate(data);
    } else {
      derivedValue = get(data, def.property);
    }
  }
  return {
    label: undefined,
    type: undefined,
    derivedValue,
    ...def,
  };
}

export const FieldValue = ({ field }: { field: ProcessedField }) => {
  const { derivedValue, type } = field;

  if (type === "globus.embed") {
    return <GlobusEmbedField field={field} />;
  }
  if (type === "rgba") {
    return <RgbaField value={derivedValue} />;
  }
  if (type === "image") {
    return <ImageField value={derivedValue} />;
  }
  if (type === "table") {
    return <TableField value={derivedValue} />;
  }
  if (type === "link") {
    return <LinkField value={derivedValue} />;
  }
  if (type === "date") {
    return <DateField value={derivedValue} />;
  }
  if (type === "date") {
    return <DateField value={derivedValue} />;
  }
  if (type === "bytes") {
    return <BytesField value={derivedValue} />;
  }
  /**
   * If no `type` is provided, or the `type` is not recognized, use the fallback field.
   */
  return <FallbackField value={derivedValue} />;
};

export const Field = ({
  field,
  gmeta,
}: {
  field: FieldDefinition;
  gmeta: GMetaResult;
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
  return (
    <Box my="2">
      {processedField.label && (
        <Heading as="h2" size="sm" my={2}>
          {processedField.label}
        </Heading>
      )}
      <FieldValue field={processedField} />
    </Box>
  );
};
