import React, { useEffect } from "react";
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
import {
  FieldDefinition,
  FieldValue,
  ProcessedField,
  getProcessedField,
} from "./Field";
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

function ResultListingFieldTableRow({
  field,
  gmeta,
}: {
  field: FieldDefinition;
  gmeta: GMetaResult;
}) {
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
    <Tr>
      <Td>{processedField.label}</Td>
      <Td>
        <FieldValue value={processedField.value} type={processedField.type} />
      </Td>
    </Tr>
  );
}

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
            return (
              <ResultListingFieldTableRow key={i} field={field} gmeta={gmeta} />
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default function ResultListing({ gmeta }: { gmeta: GMetaResult }) {
  const [heading, setHeading] = React.useState<string>();
  const [summary, setSummary] = React.useState<string>();
  const [image, setImage] = React.useState<{
    src: string;
    alt?: string;
  }>();
  getAttributeFrom<string>(gmeta, "components.ResultListing.heading").then(
    (result) => {
      setHeading(result);
    },
  );

  getAttributeFrom<string>(gmeta, "components.ResultListing.summary").then(
    (result) => {
      setSummary(result);
    },
  );

  getAttributeFrom<
    | string
    | {
        src: string;
        alt?: string;
      }
  >(gmeta, "components.ResultListing.image").then((result) => {
    let image = result;
    if (typeof image === "string") {
      image = { src: image };
    }
    setImage(image);
  });

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
