"use client";

import React, { useEffect } from "react";
import { Title, Text, Button, Box, Divider, Group, Stack } from "@mantine/core";

import {
  get,
  getStatic,
  getValueFrom,
  isObjectWithProperty,
} from "../../static-lib";
import { Error } from "./Error";
import { isGError, type GError } from "@/globus/search";
import { Field, FieldSchema, type FieldDefinition } from "./Field";
import { JSONTree } from "./JSONTree";
import ResponseDrawer from "./ResponseDrawer";
import AddToTransferList from "./AddToTransferList";

import type { GMetaResult } from "@globus/sdk/services/search/service/query";
import z from "zod";

const GlobusTransferOptionsSchema = z.object({
  type: z
    .union([
      z.enum(["file", "directory"]),
      z.object({
        /**
         * `property` can be used to reference a value from the result (subject) using JSONata.
         */
        property: z.string(),
      }),
    ])
    .optional(),
  /**
   * The collection that will be used as the `source_endpoint` for the transfer.
   */
  collection: z.union([
    z.string(),
    z.object({
      /**
       * `property` can be used to reference a value from the result (subject) using JSONata.
       */
      property: z.string(),
    }),
  ]),
  /**
   * The path that will be used as the `source_path` for the transfer.
   */
  path: z.union([
    z.string(),
    z.object({
      /**
       * `property` can be used to reference a value from the result (subject) using JSONata.
       */
      property: z.string(),
    }),
  ]),
});

const LinkSchema = z.object({
  /**
   * The label that will be rendered as the link text.
   */
  label: z.union([
    z.string(),
    z.object({
      property: z.string(),
      fallback: z.string().optional(),
    }),
  ]),
  /**
   * The location that will be used as the `href` for the link.
   */
  href: z.union([
    z.string(),
    z.object({
      property: z.string(),
      fallback: z.string().optional(),
    }),
  ]),
});

export const ResultOptionsSchema = z.object({
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
  fields: z.array(FieldSchema).optional(),
  links: z.array(LinkSchema).optional(),
  globus: z
    .object({
      transfer: GlobusTransferOptionsSchema.optional(),
    })
    .optional(),
});

export type ResultComponentOptions = z.infer<typeof ResultOptionsSchema>;

type ProcessedLink = {
  label: string | undefined;
  href: string | undefined;
};

/**
 * A basic wrapper for the `<Result />` component that will render a result or an error.
 */
export default function ResultWrapper({
  result,
}: {
  result?: GMetaResult | GError;
}) {
  return !result ? null : isGError(result) ? (
    <Error error={result} />
  ) : (
    <Result result={result} />
  );
}

/**
 * Given a `GMetaResult`, extract the necessary information to add the result to a Globus Transfer list.
 */
export async function getTransferDetailsFromResult(result: GMetaResult) {
  /**
   * The configuration for Globus Transfer found in the `static.json` file.
   */
  const config =
    getStatic().data.attributes.components?.Result?.globus?.transfer;
  /**
   * Properties that can be set on the result itself that will take precedence over the configuration.
   */

  /**
   * For `collection`, `path`, and `type`, we first check to see if there is a property configured
   * on the result itself in the `globus` object. If not, we fall back to the configuration in the `static.json` file,
   * either using a string value or property reference.
   */

  async function getTransferValue(
    property: "collection" | "path" | "type",
  ): Promise<string | undefined> {
    /**
     * Attempt to get the value from the result itself.
     */
    const { globus } = result.entries[0].content;
    if (
      isObjectWithProperty(globus, "transfer") &&
      isObjectWithProperty(globus.transfer, property) &&
      typeof globus.transfer[property] === "string"
    ) {
      const value = globus.transfer[property];
      if (typeof value === "string") {
        return value;
      }
    }
    if (config) {
      const value = config[property];
      if (value === undefined) {
        return undefined;
      }
      if (typeof value === "string") {
        /**
         * If the `static.json` configuration for the property is a string, return that value.
         */
        return value;
      }
      return await getValueFrom<string>(result, value.property);
    }
    /**
     * Otherwise, attempt to get the value from the result using the property reference.
     */
    return undefined;
  }

  const collection = await getTransferValue("collection");
  const path = await getTransferValue("path");

  const typeValue = await getTransferValue("type");
  const isValidType = typeValue === "file" || typeValue === "directory";
  const type: "file" | "directory" = isValidType ? typeValue : "file";

  return {
    collection,
    path,
    type,
  };
}

function Result({ result }: { result: GMetaResult }) {
  const [heading, setHeading] = React.useState<string>();
  const [summary, setSummary] = React.useState<string>();
  const [fields, setFields] = React.useState<FieldDefinition[]>([]);
  const [links, setLinks] = React.useState<ProcessedLink[]>([]);

  useEffect(() => {
    async function bootstrap() {
      const heading = await getValueFrom<string>(
        result,
        getStatic().data.attributes.components.Result.heading,
      );

      const summary = await getValueFrom<string>(
        result,
        getStatic().data.attributes.components.Result.summary,
      );
      const fields = get(
        getStatic().data.attributes?.components?.Result,
        "fields",
        [],
      );
      const links = await Promise.all(
        get(getStatic().data.attributes?.components?.Result, "links", []).map(
          async (link: z.infer<typeof LinkSchema>) => {
            const processedLink: ProcessedLink = {
              label: undefined,
              href: undefined,
            };
            if (typeof link.label === "string") {
              processedLink.label = link.label;
            } else {
              processedLink.label = await getValueFrom<string>(
                result,
                link.label.property,
                link.label.fallback,
              );
            }
            if (typeof link.href === "string") {
              processedLink.href = link.href;
            } else {
              processedLink.href = await getValueFrom<string>(
                result,
                link.href.property,
                link.href.fallback,
              );
            }
            return processedLink;
          },
        ),
      );
      setHeading(heading);
      setSummary(summary);
      setFields(fields);
      setLinks(links);
    }
    bootstrap();
  }, [result]);

  return (
    <Stack gap="xs">
      <Title order={1} style={{ wordBreak: "break-word" }} size="h2">
        {heading || <Text component="em">&mdash;</Text>}
      </Title>

      <Divider />

      <Group justify="end" w="100%">
        <AddToTransferList result={result} />
        <ResponseDrawer>
          <JSONTree data={result} />
        </ResponseDrawer>
      </Group>

      {links.length > 0 && (
        <Button.Group>
          {links.map((link: ProcessedLink, i: number) => {
            return (
              <Button
                key={link.href || i}
                component="a"
                href={link.href}
                size="sm"
                variant="subtle"
              >
                {link.label}
              </Button>
            );
          })}
        </Button.Group>
      )}

      <Stack gap="xs">
        {summary && (
          <Box>
            <Title order={2} size="h4">
              Summary
            </Title>
            <Text>{summary}</Text>
          </Box>
        )}

        {fields.map((field: FieldDefinition, i: number) => (
          <Field key={i} field={field} gmeta={result} />
        ))}
      </Stack>
    </Stack>
  );
}
