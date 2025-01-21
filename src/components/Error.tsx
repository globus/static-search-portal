import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  HStack,
} from "@chakra-ui/react";
import { JSONTree } from "./JSONTree";

import type { GError } from "@/globus/search";

export const Error = ({ error }: { error: GError }) => {
  return (
    <Alert
      status="error"
      flexDirection="column"
      alignItems="start"
      justifyContent="center"
    >
      <HStack>
        <AlertIcon />
        <AlertTitle>Error Encountered</AlertTitle>
      </HStack>
      <AlertDescription>{error.message}</AlertDescription>
      {error.error_data && (
        <AlertDescription w="100%">
          <Code
            bgColor="white"
            display="block"
            whiteSpace="pre-wrap"
            my={2}
            p={1}
          >
            <JSONTree data={error} />
          </Code>
        </AlertDescription>
      )}
    </Alert>
  );
};
