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

import { isTransferEnabled } from "../../../static-lib";
import { getResultLink } from "@/utils/results";
import { Icon } from "../private/Icon";

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
    <Flex justify="space-between" align="center">
      <Stack flex={1} miw={0}>
        <Anchor
          lineClamp={1}
          component={NextLink}
          href={getResultLink(item.subject)}
          onClick={onClick}
        >
          {item.label}
        </Anchor>
        <Group gap="xs" wrap="nowrap">
          {stat.isError && <Icon component={CircleAlert} color="red" />}
          {stat.data?.type === "file" && stat.data?.size && (
            <Text fz="xs">{readableBytes(stat.data?.size)}</Text>
          )}
          <Tooltip
            label={
              stat.isError ? `Unable to access "${item.path}".` : item.path
            }
            multiline
            w={300}
            style={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
              wordBreak: "break-word",
              userSelect: "all",
            }}
          >
            <Text fz="xs" lineClamp={1}>
              {item.path}
            </Text>
          </Tooltip>
        </Group>
      </Stack>
      <ActionIcon
        variant="subtle"
        color="red"
        onClick={() => removeItemBySubject(item.subject)}
        aria-label="Remove item from transfer list"
        ml="sm"
      >
        <Icon component={CircleMinus} />
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

  return isTransferEnabled() ? (
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
        <Stack>
          {items.length ? (
            <Alert
              color="blue"
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
            {Object.keys(itemsByCollection).map((collection) => (
              <Paper key={collection} p="sm" withBorder>
                <Stack>
                  <Title size="sm">
                    <CollectionName id={collection} />
                  </Title>
                  <Stack gap="xs">
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
