import React from "react";
import { Table } from "@mantine/core";
import { FieldValue } from "../Field";

type Value = Record<string, unknown>;

function isValidValue(value: unknown): value is Value {
  return typeof value === "object" && value !== null;
}

/**
 * Render a field as an RGBA color.
 */
export default function TableField({ value }: { value: unknown }) {
  if (!isValidValue(value)) {
    return;
  }
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Property</Table.Th>
          <Table.Th>Value</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Object.entries(value).map(([key, value]) => {
          return (
            <Table.Tr key={key}>
              <Table.Td>{key}</Table.Td>
              <Table.Td>
                <FieldValue
                  field={{
                    label: undefined,
                    type: undefined,
                    derivedValue: value,
                  }}
                />
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
