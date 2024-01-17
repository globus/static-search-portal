"use client";
import React from "react";
import { useRouter } from "next/router";
import {
  Heading,
  Text,
  Box,
  Code,
  Link,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Tag,
  Spacer,
  Wrap,
  WrapItem,
  Divider,
  VStack,
  StackDivider,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

import { ChevronLeftIcon } from "@chakra-ui/icons";

export default function Result({
  entry,
  isLoading,
}: {
  entry: any;
  isLoading: boolean;
}) {
  const router = useRouter();

  return (
    <>
      <Link onClick={() => router.back()}>
        <Flex alignItems="center" mb={4}>
          <ChevronLeftIcon /> <Text fontSize="sm">Back</Text>
        </Flex>
      </Link>

      <Divider my={2} />

      <Skeleton isLoaded={!isLoading}>
        <Heading as="h1" size="md" color="brand">
          {entry.title}
        </Heading>
      </Skeleton>

      <Divider my={2} />

      <Flex>
        <Box p="2">
          <Box my="2">
            <Heading as="h2" size="sm" my={2}>
              Summary
            </Heading>
            <Skeleton isLoaded={!isLoading}>
              <Text as="p">{entry.summary}</Text>
            </Skeleton>
          </Box>

          <Box my="2">
            <Heading as="h2" size="sm" my={2}>
              Purpose
            </Heading>
            <Skeleton isLoaded={!isLoading}>
              <Text as="p">{entry.purpose}</Text>
            </Skeleton>
          </Box>

          <Box my="2">
            <Wrap>
              {entry.tags.map((tag: any, i: number) => (
                <WrapItem key={i}>
                  <Skeleton isLoaded={!isLoading}>
                    <Tag>{tag.name}</Tag>
                  </Skeleton>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Box my="2">
            <Heading as="h2" size="sm" my={2}>
              Contacts
            </Heading>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={2}
              align="stretch"
            >
              {entry.contacts.map((contact: any, i: number) => (
                <Box key={i}>
                  <Text>
                    {contact.email ? (
                      <Link color="brand.500" href={`mailto:${contact.email}`}>
                        {contact.name}
                      </Link>
                    ) : (
                      contact.name
                    )}
                  </Text>
                  <Text fontSize="xs">{contact.type}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
        <Box p="2">
          <Box my="2">
            <Heading as="h2" size="xs" my={2}>
              Citation
            </Heading>
            <Skeleton isLoaded={!isLoading}>
              <Text as="cite">{entry.citation}</Text>
            </Skeleton>
          </Box>

          <Box my="2">
            <Heading as="h2" size="xs" my={2}>
              Dates
            </Heading>
            {entry.dates.map((date: any, i: number) => (
              <Skeleton isLoaded={!isLoading}>
                <Flex key={i}>
                  <Text>{date.label || date.type}</Text>
                  <Spacer />
                  <Text>{date.dateString}</Text>
                </Flex>
              </Skeleton>
            ))}
          </Box>

          {!isLoading && (
            <ResponseDrawer>
              <Code as="pre">{JSON.stringify(entry, null, 2)}</Code>
            </ResponseDrawer>
          )}
        </Box>
      </Flex>
    </>
  );
}

function ResponseDrawer({ children }: { children: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button ref={btnRef} colorScheme="gray" onClick={onOpen} size="xs">
        View Raw Search Entry
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"xl"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>

          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
