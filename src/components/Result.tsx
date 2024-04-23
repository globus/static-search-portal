"use client";

import React from "react";
import {
  Heading,
  Text,
  Box,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Divider,
  Spacer,
} from "@chakra-ui/react";

import { getAttribute, getAttributeFrom } from "../../static";
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
};

export default function Result({ result }: { result?: GMetaResult | GError }) {
  const [heading, setHeading] = React.useState<string>();
  const [summary, setSummary] = React.useState<string>();
  if (!result) {
    return null;
  }
  if (isGError(result)) {
    return <Error error={result} />;
  }

  getAttributeFrom<string>(result, "components.ResultListing.heading").then(
    (result) => {
      setHeading(result);
    },
  );

  getAttributeFrom<string>(result, "components.ResultListing.summary").then(
    (result) => {
      setSummary(result);
    },
  );

  const fields = getAttribute("components.Result.fields", []);

  return (
    <>
      <Heading as="h1" size="md" color="brand">
        {heading}
      </Heading>

      <Divider my={2} />

      <Flex>
        <Box p="2">
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
        </Box>
        <Spacer />
        <Box p="2">
          <ResponseDrawer>
            <JSONTree data={result} />
          </ResponseDrawer>
        </Box>
      </Flex>
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
        View Raw Search result
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
