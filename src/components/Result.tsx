"use client";

import React, { useEffect } from "react";
import {
  Title,
  Text,
  Button,
  Anchor,
  Box,
  Divider,
  Group,
  Stack,
} from "@mantine/core";

import {
  getAttribute,
  getValueFrom,
  getValueFromAttribute,
} from "../../static";
import { Error } from "./Error";
import { isGError, type GError } from "@/globus/search";
import { Field, type FieldDefinition } from "./Field";
import { JSONTree } from "./JSONTree";
import ResponseDrawer from "./ResponseDrawer";
import AddToTransferList from "./AddToTransferList";

import type { GMetaResult } from "@globus/sdk/services/search/service/query";

type LinkDefinition = {
  /**
   * The label that will be rendered as the link text.
   */
  label: string | { property: string; fallback?: string };
  /**
   * The location that will be used as the `href` for the link.
   */
  href:
    | string
    | {
        property: string;
        /**
         * A fallback value that will be used if the property is not found.
         */
        fallback?: string;
      };
};

export type GlobusTransferOptions = {
  type?:
    | string
    | {
        /**
         * `property` can be used to reference a value from the result (subject) using JSONata.
         */
        property: string;
      };
  /**
   * The collection that will be used as the `source_endpoint` for the transfer.
   */
  collection:
    | string
    | {
        /**
         * `property` can be used to reference a value from the result (subject) using JSONata.
         */
        property: string;
      };
  /**
   * The path that will be used as the `source_path` for the transfer.
   */
  path:
    | string
    | {
        /**
         * `property` can be used to reference a value from the result (subject) using JSONata.
         */
        property: string;
      };
};

export type ResultComponentOptions = {
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
  links?: LinkDefinition[];
  globus?: {
    /**
     * Enables Globus Transfer UI for the result.
     */
    transfer?: GlobusTransferOptions;
  };
};

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

export async function getTransferDetailsFromResult(
  result: GMetaResult,
): Promise<{
  collection: string;
  path: string;
  type: "file" | "directory";
}> {
  /**
   * The configuration for Globus Transfer found in the `static.json` file.
   */
  const config = getAttribute("components.Result.globus.transfer");
  /**
   * Properties that can be set on the result itself that will take precedence over the configuration.
   */

  /**
   * For `collection`, `path`, and `type`, we first check to see if there is a property configured
   * on the result itself in the `globus` object. If not, we fall back to the configuration in the `static.json` file,
   * either using a string value or property reference.
   */

  async function getTransferValue(property: "collection" | "path" | "type") {
    /**
     * Attempt to get the value from the result itself.
     */
    const { globus } = result.entries[0].content;
    const value = (globus as { transfer?: GlobusTransferOptions })?.transfer?.[
      property
    ];
    if (value) {
      return value;
    }
    if (typeof config[property] === "string") {
      /**
       * If the `static.json` configuration for the property is a string, return that value.
       */
      return config[property];
    }
    /**
     * Otherwise, attempt to get the value from the result using the property reference.
     */
    return getValueFrom<string>(result, config[property]?.property);
  }

  const collection = await getTransferValue("collection");
  const path = await getTransferValue("path");
  const type = await getTransferValue("type");

  return {
    collection,
    path,
    type: type || "file",
  };
}

function Result({ result }: { result: GMetaResult }) {
  const [heading, setHeading] = React.useState<string>();
  const [summary, setSummary] = React.useState<string>();
  const [fields, setFields] = React.useState<FieldDefinition[]>([]);
  const [links, setLinks] = React.useState<ProcessedLink[]>([]);

  useEffect(() => {
    async function bootstrap() {
      const heading = await getValueFromAttribute<string>(
        result,
        "components.Result.heading",
      );

      const summary = await getValueFromAttribute<string>(
        result,
        "components.Result.summary",
      );
      const fields = getAttribute("components.Result.fields", []);
      const links = await Promise.all(
        getAttribute("components.Result.links", []).map(
          async (link: LinkDefinition) => {
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
