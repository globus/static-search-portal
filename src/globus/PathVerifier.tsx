import React, { useEffect } from "react";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  isAuthorizationRequirementsError,
  isConsentRequiredError,
} from "@globus/sdk/core/errors";

import type { FileDocument } from "@globus/sdk/services/transfer/service/file-operations";
import { useOAuthStore } from "@/store/oauth";

export default function PathVerifier({
  path,
  collectionId,
}: {
  path?: string;
  collectionId?: string;
}) {
  const auth = useGlobusAuth();
  const oauthStore = useOAuthStore();
  const [isValidating, setIsValidating] = React.useState(false);
  const [isValid, setIsValid] = React.useState<null | boolean>(null);
  const [response, setResponse] = React.useState<FileDocument>();
  const [hasAddressableError, setHasAddressableError] =
    React.useState<boolean>(false);

  useEffect(() => {
    async function validate() {
      if (!collectionId || !path) {
        return;
      }
      setIsValidating(true);
      const res = await transfer.fileOperations.stat(
        collectionId,
        {
          query: {
            path,
          },
        },
        { manager: auth.authorization },
      );

      const json = await res.json();
      setResponse(json);

      if (
        isConsentRequiredError(json) ||
        isAuthorizationRequirementsError(json)
      ) {
        setHasAddressableError(true);
      }
      setIsValid(res.ok);
      setIsValidating(false);
    }
    validate();
  }, [auth.authorization, path, collectionId]);

  if (!path) {
    return;
  }

  if (!collectionId) {
    return;
  }

  return hasAddressableError ? (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>
        An error was encountered trying to access the provided path.
      </AlertDescription>
      <Box>
        <Button
          ml={2}
          size="xs"
          onClick={async () => {
            if (!response) return;
            oauthStore.setReplaceWith("/transfer");
            await auth.authorization?.handleErrorResponse(response);
          }}
        >
          Address
        </Button>
      </Box>
    </Alert>
  ) : (
    <VStack align="start">
      <Flex alignItems="center">
        {isValidating ? (
          <Spinner mr={1} />
        ) : isValid ? (
          <Icon as={CheckCircleIcon} mr={1} boxSize={6} />
        ) : (
          <Icon as={ExclamationCircleIcon} mr={1} boxSize={6} />
        )}
        {!isValidating && isValid ? (
          <Text>Path exists on destination.</Text>
        ) : (
          <>
            <Tooltip
              hasArrow
              label="We've attempted to reach the path you provided, but were unsuccessful. This might be intentional, or there might be a typo in your desired path."
              placement="bottom"
            >
              <Text
                cursor="help"
                textDecor="underline"
                textDecorationStyle="dashed"
              >
                Unable to access path on destination.
              </Text>
            </Tooltip>
          </>
        )}
      </Flex>
    </VStack>
  );
}
