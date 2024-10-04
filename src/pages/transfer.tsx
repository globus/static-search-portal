import React from "react";
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
  AlertDescription,
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
import { isTransferEnabled } from "../../static";
import PathVerifier from "@/globus/PathVerifier";
import { CollectionName } from "@/globus/Collection";

export default function ResultPage() {
  const auth = useGlobusAuth();
  const toast = useToast();
  const transferStore = useGlobusTransferStore();
  const removeItemBySubject = useGlobusTransferStore(
    (state) => state.removeItemBySubject,
  );

  if (isTransferEnabled === false) {
    return (
      <Center my={5}>
        <Text fontSize="xl">
          Globus Transfer functionality is not available in this portal.
        </Text>
      </Center>
    );
  }

  const itemsByCollection = transferStore.items.reduce(
    (acc: { [key: Item["collection"]]: Item[] }, item) => {
      if (!acc[item.collection]) {
        acc[item.collection] = [];
      }
      acc[item.collection].push(item);
      return acc;
    },
    {},
  );

  const collections = Object.keys(itemsByCollection);
  const isMultipleCollections = collections.length > 1;

  async function handleStartTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { destination, path, label } = transferStore.transfer ?? {};
    if (!path || !destination) {
      return;
    }

    collections.forEach(async (collection) => {
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
            destination_endpoint: destination.id,
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

      {transferStore.items.length === 0 ? (
        <Center>
          <Text fontSize="xl">No items in the Transfer List.</Text>
        </Center>
      ) : (
        <>
          <Box mb={8}>
            <Heading size="lg" my={4}>
              Transfer Data
            </Heading>
            <Text fontSize="lg">
              Now that you have selected the data for transfer, you'll need to
              specify a destination collection, path, and optional label for the
              transfer.
            </Text>
          </Box>
          <SimpleGrid columns={2} spacing={10}>
            <Box>
              {collections.map((collection, i) => (
                <Card key={collection} size="sm">
                  <CardHeader>
                    <Flex>
                      <Heading size="sm">
                        <CollectionName id={collection} />
                      </Heading>
                      <Spacer />
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
                                <Text
                                  noOfLines={1}
                                  fontSize="xs"
                                  maxWidth="50%"
                                >
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
              {isMultipleCollections && (
                <Alert status="info" my={2}>
                  <AlertIcon />
                  <AlertDescription>
                    Since the data you've selected is hosted across multiple
                    sources ({collections.length}), a transfer task will be
                    created for each source.
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={(e) => handleStartTransfer(e)}>
                <fieldset disabled={!auth.isAuthenticated}>
                  <VStack>
                    <FormControl>
                      <FormLabel>Destination</FormLabel>
                      <CollectionSearch
                        defaultValue={
                          transferStore.transfer?.destination ?? null
                        }
                        onSelect={(destination) => {
                          transferStore.setDestination(destination);
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Path</FormLabel>
                      <Input
                        defaultValue={transferStore.transfer?.path}
                        required
                        disabled={!auth.isAuthenticated}
                        onChange={(e) => {
                          transferStore.setPath(e.currentTarget.value);
                        }}
                      />
                      <FormHelperText>
                        {transferStore.transfer?.path && (
                          <PathVerifier
                            path={transferStore.transfer?.path}
                            collectionId={
                              transferStore.transfer?.destination?.id
                            }
                          />
                        )}
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Label</FormLabel>
                      <Input
                        defaultValue={transferStore.transfer?.label}
                        disabled={!auth.isAuthenticated}
                        onChange={(e) => {
                          transferStore.setLabel(e.currentTarget.value);
                        }}
                      />
                    </FormControl>
                    <Button
                      w="100%"
                      isDisabled={
                        !transferStore.transfer?.destination ||
                        !transferStore.transfer?.path
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
        </>
      )}
    </Container>
  );
}
