import React from "react";
import JsonView from "@uiw/react-json-view";
import { Code } from "@chakra-ui/react";

export const JSONTree = ({ data }: { data: unknown }) => {
  return typeof data === "object" && data !== null ? (
    <JsonView value={data} />
  ) : (
    <Code as="pre" overflow="scroll" maxW="100%">
      {JSON.stringify(data, null, 2)}
    </Code>
  );
};
