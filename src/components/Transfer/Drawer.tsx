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
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";

import { Item, useGlobusTransferStore } from "@/store/globus-transfer";
import NextLink from "next/link";
import { XCircleIcon } from "@heroicons/react/24/outline";

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

  return (
    <>
      <Box>
        <Button
          isDisabled={pathname === "/transfer"}
          size="sm"
          colorScheme="blue"
          onClick={onOpen}
        >
          Transfer List ({items.length})
        </Button>
      </Box>
      <Drawer size="xl" placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent h="100vh">
          <DrawerHeader borderBottomWidth="1px">
            Transfer List <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody mt={2}>
            <Flex h="100%" direction="column">
              <Stack spacing={2}>
                {items.length === 0 && (
                  <Text as="em">No items added to transfer list.</Text>
                )}
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
                      <Stack overflow="hidden">
                        {itemsByCollection[collection].map((item) => (
                          <Box key={item.subject}>
                            <HStack align="flex-start">
                              <IconButton
                                size="xs"
                                variant="ghost"
                                aria-label="Remove item from transfer list"
                                icon={<Icon as={XCircleIcon} boxSize={4} />}
                                onClick={() =>
                                  removeItemBySubject(item.subject)
                                }
                              />
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
                                  <Text noOfLines={1} fontSize="xs">
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
              </Stack>
              <Spacer />
              <Button as={NextLink} href="/transfer" onClick={onClose}>
                Configure Transfer
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
