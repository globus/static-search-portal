"use client";

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
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import NextLink from "next/link";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { CollectionName } from "@/globus/Collection";
import { isTransferEnabled } from "../../../static";

export default function TransferDrawer() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const items = useGlobusTransferStore((state) => state.items);
  const removeItemBySubject = useGlobusTransferStore(
    (state) => state.removeItemBySubject,
  );

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
          colorScheme="brand"
          onClick={onOpen}
        >
          Transfer List
          <Badge ml={2} colorScheme="brand">
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
                  <Text mb={2}>
                    These are the entries that you have selected for data
                    transfer. Data or data sets associated to entries may be
                    sourced from multiple sources, which will be visible here.
                  </Text>
                  <Text mb={2}>
                    Once you have finished selecting entries, the next step is
                    to:&nbsp;
                    <Link as={NextLink} href="/transfer" onClick={onClose}>
                      Configure your Transfer
                    </Link>
                  </Text>
                </Box>
              ) : null}
              <Stack spacing={2}>
                {items.length === 0 && (
                  <>
                    <Text fontSize="large" as="em" mt={4}>
                      No items added.
                    </Text>
                    <Text>
                      As you browse data and add entries to your Transfer List,
                      they will appear here.
                    </Text>
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
                          <Box key={item.subject}>
                            <HStack align="flex-start">
                              <Stack spacing={1}>
                                <Link
                                  noOfLines={1}
                                  as={NextLink}
                                  href={`/results?subject=${item.subject}`}
                                  onClick={onClose}
                                >
                                  {item.label}
                                </Link>
                                <Tooltip label={item.path}>
                                  <Text
                                    noOfLines={1}
                                    fontSize="xs"
                                    maxWidth="90%"
                                  >
                                    {item.path}
                                  </Text>
                                </Tooltip>
                              </Stack>
                              <Spacer />
                              <IconButton
                                variant="ghost"
                                aria-label="Remove item from transfer list"
                                icon={<Icon as={MinusCircleIcon} boxSize={6} />}
                                onClick={() =>
                                  removeItemBySubject(item.subject)
                                }
                              />
                            </HStack>
                          </Box>
                        ))}
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
              <Spacer />
              <Button
                as={NextLink}
                href="/transfer"
                onClick={onClose}
                isDisabled={items.length === 0}
              >
                Next Step: Configure your Transfer
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  ) : null;
}
