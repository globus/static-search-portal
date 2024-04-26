"use client";
import React, { useEffect } from "react";
import {
  Heading,
  Text,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Divider,
  ButtonGroup,
  Link,
} from "@chakra-ui/react";

import {
  LinkDefinition,
  getAttribute,
  getValueFrom,
  getValueFromAttribute,
} from "../../static";
import { Error } from "./Error";
import { isGError, type GError, type GMetaResult } from "@/globus/search";
import { Field, type FieldDefinition } from "./Field";
import { JSONTree } from "./JSONTree";

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
  if (!result) {
    return null;
  }
  if (isGError(result)) {
    return <Error error={result} />;
  }
  return <Result result={result} />;
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
        "components.ResultListing.heading",
      );
      const summary = await getValueFromAttribute<string>(
        result,
        "components.ResultListing.summary",
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
    <>
      <Heading as="h1" size="md" color="brand">
        {heading || (
          <Text as="em" color="gray.500">
            &mdash;
          </Text>
        )}{" "}
      </Heading>

      <Divider my={2} />

      {links.length > 0 && (
        <ButtonGroup>
          {links.map((link: ProcessedLink, i: number) => {
            return (
              <Button key={link.href || i} as={Link} href={link.href} size="sm">
                {link.label}
              </Button>
            );
          })}
        </ButtonGroup>
      )}

      {summary && (
        <Box my="2">
          <Heading as="h2" size="sm" my={2}>
            Summary
          </Heading>
          <Text as="p">{summary}</Text>
        </Box>
      )}

      {fields.map((field: FieldDefinition, i: number) => (
        <Field key={i} field={field} gmeta={result} />
      ))}

      <ResponseDrawer>
        <JSONTree data={result} />
      </ResponseDrawer>
    </>
  );
}

function ResponseDrawer({ children }: { children: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button
        ref={btnRef.current}
        colorScheme="gray"
        onClick={onOpen}
        size="xs"
      >
        View Raw Search Result
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef.current}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
