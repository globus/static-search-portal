import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  HStack,
} from "@chakra-ui/react";

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
            bgColor="red.50"
            display="block"
            whiteSpace="pre-wrap"
            my={2}
            p={1}
          >
            {JSON.stringify(error, null, 2)}
          </Code>
        </AlertDescription>
      )}
    </Alert>
  );
};
