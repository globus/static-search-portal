import React from "react";
import NextLink from "next/link";
import {
  LinkBox,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  TableContainer,
  Tbody,
  Tr,
  Td,
  HStack,
} from "@chakra-ui/react";
import { getAttributeFrom, getAttribute } from "../../static";

import type { GMetaResult } from "@/globus/search";
import { FieldDefinition, FieldValue, getProcessedField } from "./Field";
import ImageField from "./Fields/ImageField";

export type ResultListingComponentOptions = {
  /**
   * The field to use as the title for the result.
   * @default "subject"
   * @example "entries[0].content.title"
   * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
   */
  heading?: string;
  /**
   * The field to use as the summary for the result.
   * @example "entries[0].content.summary"
   * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
   */
  summary?: string;
  /**
   * An image to display in the result.
   * @example "entries[0].content.image"
   */
  image?:
    | string
    | {
        src: string;
        alt?: string;
      };
  /**
   * The fields to display in the result.
   * A field can be a string, an object with a `label` and `property`, or an object with a `label` and `value`.
   * @example
   * ["entries[0].content.purpose", "entries[0].content.tags"]
   * @example
   * [
   *    "entries[0].content.tags",
   *    { label: "Purpose", "property": "entries[0].content.purpose" },
   *    { label: "Note", value: "Lorem ipsum dolor sit amet."}
   * ]
   */
  fields?: FieldDefinition[];
};

function ResultListingFields({
  fields,
  gmeta,
}: {
  fields: ResultListingComponentOptions["fields"];
  gmeta: GMetaResult;
}) {
  if (!fields || fields.length === 0) {
    return null;
  }
  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          {fields.map((field: FieldDefinition, i: number) => {
            const processedField = getProcessedField(field, gmeta);
            return (
              <Tr key={i}>
                <Td>{processedField.label}</Td>
                <Td>
                  <FieldValue
                    value={processedField.value}
                    type={processedField.type}
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

export default function ResultListing({ gmeta }: { gmeta: GMetaResult }) {
  const heading = getAttributeFrom<string>(
    gmeta,
    "components.ResultListing.heading",
  );

  const summary = getAttributeFrom<string>(
    gmeta,
    "components.ResultListing.summary",
  );

  let image = getAttributeFrom<
    | string
    | {
        src: string;
        alt?: string;
      }
  >(gmeta, "components.ResultListing.image");
  if (typeof image === "string") {
    image = { src: image };
  }

  const fields = getAttribute("components.ResultListing.fields");

  return (
    <LinkBox
      as={NextLink}
      href={`/results?subject=${encodeURIComponent(gmeta.subject)}`}
    >
      <Card size="sm" w="full">
        <CardHeader>
          <Heading size="md" color="brand">
            {heading}
          </Heading>
        </CardHeader>
        <CardBody>
          <HStack>
            {image && (
              <ImageField
                value={{
                  src: image.src,
                  alt: image?.alt,
                }}
              />
            )}
            {summary && <Text noOfLines={[3, 5, 10]}>{summary}</Text>}
          </HStack>
          <ResultListingFields fields={fields} gmeta={gmeta} />
        </CardBody>
      </Card>
    </LinkBox>
  );
}
