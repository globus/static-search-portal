import React, { useEffect } from "react";
import NextLink from "next/link";
import {
  Anchor,
  Card,
  Title,
  Text,
  Table,
  Skeleton,
  Stack,
  Group,
  Box,
} from "@mantine/core";
import { getValueFrom, getStatic } from "../../static-lib";

import type { GMetaResult } from "@globus/sdk/services/search/service/query";
import {
  FieldDefinition,
  FieldValue,
  ProcessedField,
  getProcessedField,
} from "./Field";
import ImageField from "./Fields/ImageField";
import AddToTransferList from "./AddToTransferList";
import { getResultLink } from "@/utils/results";
import { z } from "zod";

export const ResultListingOptionsSchema = z.object({
  /**
   * The field to use as the title for the result.
   * @default "subject"
   * @example "entries[0].content.title"
   * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
   */
  heading: z.string().optional().default("subject"),
  /**
   * The field to use as the summary for the result.
   * @example "entries[0].content.summary"
   * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
   */
  summary: z.string().optional(),
  /**
   * An image to display in the result.
   * @example "entries[0].content.image"
   */
  image: z
    .union([
      z.string(),
      z.object({
        src: z.string(),
        alt: z.string().optional(),
      }),
    ])
    .optional(),
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
  fields: z
    .array(
      z.union([
        z.string(),
        z.object({
          label: z.string(),
          property: z.string(),
        }),
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      ]),
    )
    .optional(),
});

export type ResultListingComponentOptions = z.infer<
  typeof ResultListingOptionsSchema
>;

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
    <Table.Tr>
      <Table.Td>{processedField.label}</Table.Td>
      <Table.Td>
        <FieldValue field={processedField} />
      </Table.Td>
    </Table.Tr>
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
    <Table>
      <Table.Tbody>
        {fields.map((field: FieldDefinition, i: number) => {
          return (
            <ResultListingFieldTableRow key={i} field={field} gmeta={gmeta} />
          );
        })}
      </Table.Tbody>
    </Table>
  );
}

export default function ResultListing({ gmeta }: { gmeta: GMetaResult }) {
  const [heading, setHeading] = React.useState<string>();
  const [summary, setSummary] = React.useState<string>();
  const [image, setImage] = React.useState<{
    src: string;
    alt?: string;
  }>();
  const [boostrapping, setBoostrapping] = React.useState(true);

  useEffect(() => {
    async function resolveAttributes() {
      const heading = await getValueFrom<string>(
        gmeta,
        getStatic().data.attributes.components?.ResultListing?.heading,
      );
      const summary = await getValueFrom<string>(
        gmeta,
        getStatic().data.attributes.components?.ResultListing?.summary,
      );
      let image = await getValueFrom<
        | string
        | {
            src: string;
            alt?: string;
          }
      >(gmeta, getStatic().data.attributes.components?.ResultListing?.image);

      setHeading(heading);
      setSummary(summary);

      if (typeof image === "string") {
        image = { src: image };
      }
      setImage(image);
      setBoostrapping(false);
    }
    resolveAttributes();
  }, [gmeta]);

  const fields =
    getStatic().data.attributes.components?.ResultListing?.fields || [];

  return (
    <Card w="full" withBorder>
      <Stack gap="xs">
        <Title order={3} style={{ wordBreak: "break-word" }}>
          <Anchor
            component={NextLink}
            href={gmeta.subject ? getResultLink(gmeta.subject) : "#"}
          >
            <Skeleton visible={boostrapping}>
              {heading || (
                <Text component="em" c="gray.5">
                  &mdash;
                </Text>
              )}
            </Skeleton>
          </Anchor>
        </Title>
        <Group justify="flex-end">
          <AddToTransferList result={gmeta} size="xs" />
        </Group>
        {image || summary || fields ? (
          <Box>
            <Stack gap="xs">
              {image && (
                <ImageField
                  value={{
                    src: image.src,
                    alt: image?.alt,
                  }}
                />
              )}
              {summary && <Text lineClamp={4}>{summary}</Text>}
            </Stack>
            <ResultListingFields fields={fields} gmeta={gmeta} />
          </Box>
        ) : null}
      </Stack>
    </Card>
  );
}
