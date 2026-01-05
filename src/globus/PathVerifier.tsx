import React, { useEffect } from "react";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";
import {
  Alert,
  Stack,
  Loader,
  Text,
  Tooltip,
  Button,
  Box,
  Group,
} from "@mantine/core";
import { CircleCheck, CircleAlert } from "lucide-react";
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
    <Alert color="red">
      An error was encountered trying to access the provided path.
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
    <Stack align="start">
      <Group gap="xs">
        {isValidating ? (
          <Loader size="xs" />
        ) : isValid ? (
          <CircleCheck />
        ) : (
          <CircleAlert />
        )}
        {!isValidating && isValid ? (
          <Text>Path exists on destination.</Text>
        ) : (
          <>
            <Tooltip
              label="We've attempted to reach the path you provided, but were unsuccessful. This might be intentional, or there might be a typo in your desired path."
              position="bottom"
            >
              <Text
                style={{
                  cursor: "help",
                  textDecoration: "underline",
                  textDecorationStyle: "dashed",
                }}
              >
                Unable to access path on destination.
              </Text>
            </Tooltip>
          </>
        )}
      </Group>
    </Stack>
  );
}
