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
  Icon,
  Spacer,
  Stack,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  FormHelperText,
  AlertDescription,
  IconButton,
} from "@chakra-ui/react";
import {
  ArrowTopRightOnSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { transfer, webapp } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";
import { CollectionBrowser } from "@globus/react-components";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import { isTransferEnabled } from "../../static";
import PathVerifier from "@/globus/PathVerifier";
import { CollectionName } from "@/globus/Collection";
import { TransferListItem } from "@/components/Transfer/Drawer";

export default function TransferPage() {
  const auth = useGlobusAuth();
  const toast = useToast();
  const transferStore = useGlobusTransferStore();

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

      const basePath = path.endsWith("/") ? path : `${path}/`;
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
                destination_path: `${basePath}${item.path}`,
                recursive: item.type === "directory",
              };
            }),
          },
        },
        { manager: auth.authorization },
      );

      const data = await response.json();

      if (response.ok) {
        transferStore.resetTransferSettings();
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
                        <TransferListItem key={item.subject} item={item} />
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
                      {transferStore.transfer?.destination ? (
                        <Flex alignItems="center">
                          <CollectionName
                            id={transferStore.transfer.destination.id}
                          />
                          <Spacer />
                          <IconButton
                            variant="ghost"
                            size="sm"
                            isRound
                            aria-label="Clear"
                            colorScheme="gray"
                            icon={<Icon as={XCircleIcon} boxSize={6} />}
                            onClick={() => {
                              transferStore.setDestination(undefined);
                              transferStore.setPath("");
                            }}
                          />
                        </Flex>
                      ) : (
                        <CollectionBrowser
                          onSelect={({ collection, path }) => {
                            transferStore.setDestination(collection);
                            if (path) {
                              transferStore.setPath(path);
                            }
                          }}
                        />
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Path</FormLabel>
                      <Input
                        value={transferStore.transfer?.path || ""}
                        required
                        disabled={!auth.isAuthenticated}
                        onChange={(e) => {
                          transferStore.setPath(e.currentTarget.value);
                        }}
                      />
                      <FormHelperText>
                        {transferStore.transfer?.path && (
                          <PathVerifier
                            path={transferStore.transfer.path}
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
                        value={transferStore.transfer?.label || ""}
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
