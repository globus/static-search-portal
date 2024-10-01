import React, { useEffect } from "react";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Flex, Icon, Spinner, Text, Tooltip } from "@chakra-ui/react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

import { FileDocument } from "@globus/sdk/services/transfer/service/file-operations";
import { QuestionIcon } from "@chakra-ui/icons";

export default function PathVerifier({
  path,
  collectionId,
}: {
  path?: string;
  collectionId?: string;
}) {
  const auth = useGlobusAuth();
  const [isValidating, setIsValidating] = React.useState(false);
  const [isValid, setIsValid] = React.useState<boolean | FileDocument>(null);

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

  return (
    <Flex alignItems={"center"}>
      {isValidating ? (
        <Spinner mr={1} />
      ) : isValid ? (
        <Icon as={CheckCircleIcon} mr={1} />
      ) : (
        <Icon as={ExclamationCircleIcon} mr={1} />
      )}
      {!isValidating &&
        (isValid ? (
          <Text>Path exists on destination.</Text>
        ) : (
          <>
            <Tooltip
              hasArrow
              label="We've attempted to reach the path you provided, but were unsuccessful. This might be intentional, or there might be a typo."
              placement="bottom"
            >
              <Text
                cursor={"help"}
                textDecor={"underline"}
                textDecorationStyle={"dashed"}
              >
                Unable to access path on destination.
              </Text>
            </Tooltip>
          </>
        ))}
    </Flex>
  );
}
