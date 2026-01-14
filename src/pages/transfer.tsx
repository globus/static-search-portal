import React from "react";
import {
  Container,
  Text,
  Center,
  Title,
  Box,
  Button,
  TextInput,
  Alert,
  Stack,
  Group,
  SimpleGrid,
  Paper,
  Fieldset,
} from "@mantine/core";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import { CollectionSearch } from "@/globus/collection-browser/CollectionBrowser";
import { isTransferEnabled } from "../../static-lib";
import PathVerifier from "@/globus/PathVerifier";
import { CollectionName } from "@/globus/Collection";
import { TransferListItem } from "@/components/Transfer/Drawer";
import { notifications } from "@mantine/notifications";

export default function TransferPage() {
  const auth = useGlobusAuth();
  const transferStore = useGlobusTransferStore();

  if (isTransferEnabled() === false) {
    return (
      <Center mt={20}>
        <Text size="xl">
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

  const handleStartTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
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
                destination_path: `${basePath}${item.path}`,
                recursive: item.type === "directory",
              };
            }),
          },
        },
        { manager: auth.authorization },
      );
      const data = await response.json();
      if (
        response.ok &&
        "DATA_TYPE" in data &&
        data.DATA_TYPE === "transfer_result"
      ) {
        transferStore.resetTransferSettings();
        notifications.show({
          title: "Transfer Started",
          message: `Transfer task ${data.task_id} has been started successfully.`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "Transfer Error",
          message: `Error (${data.code}): ${data.message}`,
          color: "red",
        });
      }
    });
  };

  return (
    <Container size="xl">
      {auth.isAuthenticated === false && (
        <Alert color="red" title="Authentication Required" mb="md">
          You must authenticate to initiate a transfer.
        </Alert>
      )}
      {transferStore.items.length === 0 ? (
        <Center mt="25%">
          <Alert color="blue" title="No Items Selected for Transfer">
            <Text>
              Select items from search results to add them to your Transfer List
            </Text>
          </Alert>
        </Center>
      ) : (
        <Stack>
          <Stack gap="xs">
            <Title order={2}>Transfer Data</Title>
            <Text size="lg">
              Now that you have selected the data for transfer, you&apos;ll need
              to specify a destination collection, path, and optional label for
              the transfer.
            </Text>
          </Stack>
          <SimpleGrid
            cols={{
              base: 1,
              sm: 2,
            }}
          >
            <Stack>
              {collections.map((collection) => (
                <Paper key={collection} withBorder p="sm" radius="md">
                  <Group style={{ justifyContent: "space-between" }}>
                    <Title order={4}>
                      <CollectionName id={collection} />
                    </Title>
                  </Group>
                  <Stack gap="xs">
                    {itemsByCollection[collection].map((item) => (
                      <TransferListItem key={item.subject} item={item} />
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Box>
              {isMultipleCollections && (
                <Alert color="blue" mb="md">
                  Since the data you&apos;ve selected is hosted across multiple
                  sources ({collections.length}), a transfer task will be
                  created for each source.
                </Alert>
              )}
              <form onSubmit={handleStartTransfer}>
                <Fieldset
                  legend="Transfer Options"
                  disabled={!auth.isAuthenticated}
                >
                  <Stack>
                    <CollectionSearch
                      value={transferStore.transfer?.destination ?? null}
                      onSelect={(destination) => {
                        transferStore.setDestination(destination);
                      }}
                    />
                    <TextInput
                      label="Path"
                      value={transferStore.transfer?.path || ""}
                      required
                      disabled={!auth.isAuthenticated}
                      onChange={(e) => {
                        transferStore.setPath(e.currentTarget.value);
                      }}
                    />
                    {transferStore.transfer?.path && (
                      <Box mt={-10} mb={10}>
                        <PathVerifier
                          path={transferStore.transfer.path}
                          collectionId={transferStore.transfer?.destination?.id}
                        />
                      </Box>
                    )}
                    <TextInput
                      label="Label"
                      value={transferStore.transfer?.label || ""}
                      disabled={!auth.isAuthenticated}
                      onChange={(e) => {
                        transferStore.setLabel(e.currentTarget.value);
                      }}
                    />
                    <Button
                      fullWidth
                      disabled={
                        !transferStore.transfer?.destination ||
                        !transferStore.transfer?.path
                      }
                      type="submit"
                    >
                      Start Transfer
                    </Button>
                  </Stack>
                </Fieldset>
              </form>
            </Box>
          </SimpleGrid>
        </Stack>
      )}
    </Container>
  );
}
