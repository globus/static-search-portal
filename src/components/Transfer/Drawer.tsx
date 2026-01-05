import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Anchor,
  Tooltip,
  Drawer,
  Button,
  Flex,
  Text,
  Alert,
  Stack,
  Group,
  Badge,
  ActionIcon,
  Title,
  Paper,
} from "@mantine/core";

import { usePathname } from "next/navigation";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import NextLink from "next/link";
import { CircleMinus, CircleAlert } from "lucide-react";
import { CollectionName } from "@/globus/Collection";
import { useStat } from "@/hooks/useGlobusAPI";
import { readableBytes } from "@globus/sdk/services/transfer/utils";

import { isTransferEnabled } from "../../../static";
import { getResultLink } from "@/utils/results";

export const TransferListItem = ({
  item,
  onClick = () => {},
}: {
  item: Item;
  onClick?: () => void;
}) => {
  const stat = useStat(item.collection, item.path);
  const removeItemBySubject = useGlobusTransferStore(
    (state) => state.removeItemBySubject,
  );
  return (
    <Flex key={item.subject} align="center" justify="space-between">
      <Stack>
        <Anchor
          lineClamp={1}
          component={NextLink}
          href={getResultLink(item.subject)}
          onClick={onClick}
        >
          {item.label}
        </Anchor>
        <Group>
          {stat.data?.type === "file" && stat.data?.size && (
            <Text fz="xs">{readableBytes(stat.data?.size)}</Text>
          )}
          <Tooltip
            label={
              stat.isError ? `Unable to access "${item.path}".` : item.path
            }
          >
            <Text
              lineClamp={1}
              fz="xs"
              style={{
                overflow: "scroll",
                whiteSpace: "nowrap",
              }}
            >
              <Flex align="center">
                {stat.isError && <CircleAlert color="red" />}
                {item.path}
              </Flex>
            </Text>
          </Tooltip>
        </Group>
      </Stack>
      <ActionIcon
        variant="subtle"
        color="red"
        onClick={() => removeItemBySubject(item.subject)}
        aria-label="Remove item from transfer list"
      >
        <CircleMinus />
      </ActionIcon>
    </Flex>
  );
};

export default function TransferDrawer() {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);

  const items = useGlobusTransferStore((state) => state.items);

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

  return isTransferEnabled ? (
    <>
      <Button
        disabled={pathname === "/transfer"}
        size="sm"
        onClick={open}
        rightSection={
          <Badge variant="default" circle>
            {items.length}
          </Badge>
        }
      >
        Transfer List
      </Button>
      <Drawer
        size="xl"
        onClose={close}
        opened={opened}
        title="Transfer List"
        position="right"
      >
        <Stack h="100%">
          {items.length ? (
            <Alert
              color="blue"
              variant="outline"
              title="These are the entries that you have selected for data
                  transfer."
            >
              Data or datasets associated to entries may be sourced from
              multiple sources, which will be visible here.
            </Alert>
          ) : null}
          <Stack>
            {items.length === 0 && (
              <Alert color="blue" variant="outline" title="No items added.">
                As you browse data and add entries to your Transfer List, they
                will appear here.
              </Alert>
            )}
            {Object.keys(itemsByCollection).map((collection, i) => (
              <Paper key={collection} p="sm" withBorder>
                <Stack>
                  <Title size="sm">
                    <CollectionName id={collection} />
                  </Title>
                  <Stack>
                    {itemsByCollection[collection].map((item) => (
                      <TransferListItem
                        key={item.subject}
                        item={item}
                        onClick={close}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
          {items.length > 0 && (
            <Button
              component={NextLink}
              href="/transfer"
              onClick={close}
              disabled={items.length === 0}
            >
              Next Step: Configure your Transfer
            </Button>
          )}
        </Stack>
      </Drawer>
    </>
  ) : null;
}
