import React from "react";
import {
  Container,
  Text,
  Center,
  Title,
  Card,
  Box,
  Button,
  TextInput,
  Alert,
  Stack,
  Group,
} from "@mantine/core";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import { CollectionSearch } from "@/globus/collection-browser/CollectionBrowser";
import { isTransferEnabled } from "../../static";
import PathVerifier from "@/globus/PathVerifier";
import { CollectionName } from "@/globus/Collection";
import { TransferListItem } from "@/components/Transfer/Drawer";

export default function TransferPage() {
  const auth = useGlobusAuth();
  const transferStore = useGlobusTransferStore();

  if (isTransferEnabled === false) {
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
      // TODO: Replace Chakra toast with Mantine Notification or Alert
      if (response.ok) {
        transferStore.resetTransferSettings();
        // Fallback: show a success alert (could be state-driven)
        alert(`Transfer: ${data.code}\n${data.message}`);
      } else {
        alert(`Error (${data.code}): ${data.message}`);
      }
    });
  };

  return (
    <Container size="xl" px={20} py={20}>
      {auth.isAuthenticated === false && (
        <Alert color="red" mb={20}>
          You must authenticate to initiate a transfer.
        </Alert>
      )}
      {transferStore.items.length === 0 ? (
        <Center>
          <Text size="xl">No items in the Transfer List.</Text>
        </Center>
      ) : (
        <>
          <Box mb={40}>
            <Title order={2} mb={10}>
              Transfer Data
            </Title>
            <Text size="lg">
              Now that you have selected the data for transfer, you'll need to
              specify a destination collection, path, and optional label for the
              transfer.
            </Text>
          </Box>
          <Group align="start" style={{ gap: 40 }}>
            <Box style={{ flex: 1 }}>
              {collections.map((collection) => (
                <Card
                  key={collection}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  style={{ marginBottom: 20 }}
                >
                  <Group style={{ justifyContent: "space-between" }}>
                    <Title order={4}>
                      <CollectionName id={collection} />
                    </Title>
                  </Group>
                  <Stack style={{ marginTop: 10, gap: 10 }}>
                    {itemsByCollection[collection].map((item) => (
                      <TransferListItem key={item.subject} item={item} />
                    ))}
                  </Stack>
                </Card>
              ))}
            </Box>
            <Box style={{ flex: 1 }}>
              {isMultipleCollections && (
                <Alert color="blue" style={{ marginBottom: 20 }}>
                  Since the data you've selected is hosted across multiple
                  sources ({collections.length}), a transfer task will be
                  created for each source.
                </Alert>
              )}
              <form onSubmit={handleStartTransfer}>
                <fieldset
                  disabled={!auth.isAuthenticated}
                  style={{ border: "none", padding: 0 }}
                >
                  <Stack style={{ gap: 20 }}>
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
                </fieldset>
              </form>
            </Box>
          </Group>
        </>
      )}
    </Container>
  );
}
