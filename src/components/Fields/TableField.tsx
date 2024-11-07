import React from "react";
import {
  Table,
  Tbody,
  Tr,
  Thead,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
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
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(value).map(([key, value]) => {
            return (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <FieldValue
                    field={{
                      label: undefined,
                      type: undefined,
                      derivedValue: value,
                    }}
                  />
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
