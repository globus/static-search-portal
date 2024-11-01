import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Box,
  Link,
  Heading,
  Spacer,
  Flex,
  Text,
  Stack,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Icon,
  HStack,
  Tooltip,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import NextLink from "next/link";
import {
  ExclamationCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
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
    <Box key={item.subject}>
      <HStack align="flex-start">
        <Stack spacing={1}>
          <Link
            noOfLines={1}
            as={NextLink}
            href={getResultLink(item.subject)}
            onClick={onClick}
          >
            {item.label}
          </Link>
          <HStack>
            {stat.data?.type === "file" && stat.data?.size && (
              <Text fontSize="xs">{readableBytes(stat.data?.size)}</Text>
            )}
            <Tooltip
              label={
                stat.isError ? `Unable to access "${item.path}".` : item.path
              }
            >
              <Text noOfLines={1} fontSize="xs">
                <Flex align="center">
                  {stat.isError && (
                    <Icon
                      as={ExclamationCircleIcon}
                      boxSize={4}
                      color="red.500"
                      mr={1}
                    />
                  )}
                  {item.path}
                </Flex>
              </Text>
            </Tooltip>
          </HStack>
        </Stack>
        <Spacer />
        <IconButton
          variant="ghost"
          aria-label="Remove item from transfer list"
          icon={<Icon as={MinusCircleIcon} boxSize={6} />}
          onClick={() => removeItemBySubject(item.subject)}
        />
      </HStack>
    </Box>
  );
};

export default function TransferDrawer() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      <Box>
        <Button
          isDisabled={pathname === "/transfer"}
          size="sm"
          colorScheme="primary"
          onClick={onOpen}
        >
          Transfer List
          <Badge ml={2} colorScheme="primary">
            {items.length}
          </Badge>
        </Button>
      </Box>
      <Drawer size="xl" placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent h="100vh">
          <DrawerHeader borderBottomWidth="1px">
            Transfer List <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>
            <Flex h="100%" direction="column">
              {items.length ? (
                <Box my={2}>
                  <Alert
                    status="info"
                    variant="subtle"
                    flexDirection="column"
                    alignItems="start"
                  >
                    <AlertTitle>
                      These are the entries that you have selected for data
                      transfer.
                    </AlertTitle>
                    <AlertDescription>
                      Data or datasets associated to entries may be sourced from
                      multiple sources, which will be visible here.
                    </AlertDescription>
                  </Alert>
                </Box>
              ) : null}
              <Stack spacing={2}>
                {items.length === 0 && (
                  <>
                    <Alert status="warning">
                      <AlertIcon />
                      <AlertTitle>No items added.</AlertTitle>
                      <AlertDescription>
                        As you browse data and add entries to your Transfer
                        List, they will appear here.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
                {Object.keys(itemsByCollection).map((collection, i) => (
                  <Card key={collection} size="sm">
                    <CardHeader>
                      <Flex>
                        <Heading size="sm">
                          <CollectionName id={collection} />
                        </Heading>
                        <Spacer />
                        {/* <Button size="xs">Remove Collection + Items</Button> */}
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Stack overflow="hidden">
                        {itemsByCollection[collection].map((item) => (
                          <TransferListItem
                            key={item.subject}
                            item={item}
                            onClick={onClose}
                          />
                        ))}
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
              <Spacer />
              {items.length > 0 && (
                <Button
                  as={NextLink}
                  href="/transfer"
                  onClick={onClose}
                  isDisabled={items.length === 0}
                >
                  Next Step: Configure your Transfer
                </Button>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  ) : null;
}
