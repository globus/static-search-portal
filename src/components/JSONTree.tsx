import React from "react";

import { Code } from "@chakra-ui/react";

/**
 * @todo
 */
export const JSONTree = ({ data }: { data: unknown }) => {
  return <Code as="pre">{JSON.stringify(data, null, 2)}</Code>;
};
