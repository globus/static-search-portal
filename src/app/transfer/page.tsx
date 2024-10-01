"use client";
import React, { useState } from "react";
import {
  Container,
  Text,
  Link,
  Flex,
  Center,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Box,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Stack,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  SimpleGrid,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  FormHelperText,
} from "@chakra-ui/react";
import {
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import NextLink from "next/link";
import { transfer, webapp } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import { CollectionSearch } from "@/globus/collection-browser/CollectionBrowser";
import { isTransferEnabled } from "../../../static";
import PathVerifier from "@/globus/PathVerifier";

export default function ResultPage() {
  const auth = useGlobusAuth();
  const toast = useToast();
  const items = useGlobusTransferStore((state) => state.items);
  const removeItemBySubject = useGlobusTransferStore(
    (state) => state.removeItemBySubject,
  );

  const [transferSettings, setTransferSettings] = useState<{
    destination: string | undefined;
    path: string | undefined;
    label: string | undefined;
  }>({
    destination: undefined,
    path: undefined,
    label: undefined,
  });

  if (isTransferEnabled === false) {
    return (
      <Center my={5}>
        <Text fontSize="xl">
          Globus Transfer functionality is not available in this portal.
        </Text>
      </Center>
    );
  }

  const itemsByCollection = items.reduce(
    (acc: { [key: Item["collection"]]: Item[] }, item) => {
      if (!acc[item.collection]) {
        acc[item.collection] = [];
      }
      acc[item.collection].push(item);
      return acc;
    },
    {},
  );

  async function handleStartTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { destination, path, label } = transferSettings;
    if (!path || !destination) {
      return;
    }

    Object.keys(itemsByCollection).forEach(async (collection) => {
      const id = await (
        await transfer.taskSubmission.submissionId(
          {},
          { manager: auth.authorization },
        )
      ).json();

      const response = await transfer.taskSubmission.submitTransfer(
        {
          payload: {
            submission_id: id.value,
            label,
            source_endpoint: collection,
            destination_endpoint: destination,
            DATA: itemsByCollection[collection].map((item) => {
              return {
                DATA_TYPE: "transfer_item",
                source_path: item.path,
                /**
                 * @todo Should we allow (or require) configuration of `item.name` and `item.type`?
                 */
                destination_path: `${path}${item.path}`,
                recursive: item.type === "directory",
              };
            }),
          },
        },
        { manager: auth.authorization },
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: `Transfer: ${data.code}`,
          description: (
            <>
              {data.message}
              {"task_id" in data && (
                <Flex>
                  <Spacer />
                  <Link
                    href={webapp.urlFor("TASK", [data.task_id]).toString()}
                    isExternal
                  >
                    View task in Globus Web App{" "}
                    <Icon as={ArrowTopRightOnSquareIcon} />
                  </Link>
                </Flex>
              )}
            </>
          ),
          status: "success",
          isClosable: true,
        });
      } else {
        toast({
          title: `Error (${data.code})`,
          description: data.message,
          status: "error",
          isClosable: true,
        });
      }
    });
  }

  return (
    <Container maxW="container.xl" p={4}>
      {auth.isAuthenticated === false && (
        <Alert status="error" my={2}>
          <AlertIcon />
          <AlertTitle>You must authenticate to initiate a transfer.</AlertTitle>
        </Alert>
      )}

      {items.length === 0 ? (
        <Center>
          <Text fontSize="xl">No items in the transfer list.</Text>
        </Center>
      ) : (
        <SimpleGrid columns={2} spacing={10}>
          <Box>
            {Object.keys(itemsByCollection).map((collection, i) => (
              <Card key={collection}>
                <CardHeader>
                  <Flex>
                    <Heading size="sm">
                      Collection {i + 1} ({collection})
                    </Heading>
                    <Spacer />
                    {/* <Button size="xs">Remove Collection + Items</Button> */}
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Stack>
                    {itemsByCollection[collection].map((item) => (
                      <Box key={item.subject}>
                        <HStack align="flex-start">
                          <IconButton
                            size="xs"
                            variant="ghost"
                            aria-label="Remove item from transfer list"
                            icon={<Icon as={XCircleIcon} boxSize={4} />}
                            onClick={() => removeItemBySubject(item.subject)}
                          />
                          <Stack spacing={1}>
                            <Link
                              noOfLines={1}
                              as={NextLink}
                              href={`/results?subject=${item.subject}`}
                            >
                              {item.label}
                            </Link>
                            <Tooltip label={item.path}>
                              <Text noOfLines={1} fontSize="xs" maxWidth="50%">
                                {item.path}
                              </Text>
                            </Tooltip>
                          </Stack>
                          <Spacer />
                        </HStack>
                      </Box>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Box>
          <Box>
            <form onSubmit={(e) => handleStartTransfer(e)}>
              <fieldset disabled={!auth.isAuthenticated}>
                <VStack>
                  <FormControl>
                    <FormLabel>Destination</FormLabel>
                    <CollectionSearch
                      onSelect={(destination) => {
                        setTransferSettings({
                          ...transferSettings,
                          destination: destination.id,
                        });
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Path</FormLabel>
                    <Input
                      disabled={!auth.isAuthenticated}
                      onChange={(e) => {
                        setTransferSettings({
                          ...transferSettings,
                          path: e.currentTarget.value,
                        });
                      }}
                    />
                    <FormHelperText>
                      {transferSettings?.path && (
                        <PathVerifier
                          path={transferSettings.path}
                          collectionId={transferSettings.destination}
                        />
                      )}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Label</FormLabel>
                    <Input
                      disabled={!auth.isAuthenticated}
                      onChange={(e) => {
                        setTransferSettings({
                          ...transferSettings,
                          label: e.currentTarget.value,
                        });
                      }}
                    />
                  </FormControl>
                  <Button
                    w="100%"
                    isDisabled={
                      !transferSettings?.destination || !transferSettings?.path
                    }
                    type="submit"
                  >
                    Start Transfer
                  </Button>
                </VStack>
              </fieldset>
            </form>
          </Box>
        </SimpleGrid>
      )}
    </Container>
  );
}
