import React from "react";
import {
  HStack,
  Heading,
  Box,
  Image,
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Link from "next/link";

import TransferDrawer from "@/components/Transfer/Drawer";

import { getAttribute, withFeature } from "../../static";

const SEARCH_INDEX = getAttribute("globus.search.index");
const LOGO = getAttribute("content.logo");
const HEADLINE = getAttribute(
  "content.headline",
  `Search Index ${SEARCH_INDEX}`,
);

export function Authentication() {
  const auth = useGlobusAuth();
  const user = auth.authorization?.user;
  return (
    <>
      {auth.isAuthenticated && user ? (
        <>
          <HStack as="nav" spacing={4}>
            <TransferDrawer />
            <Menu placement="bottom-end">
              <MenuButton
                colorScheme="gray"
                size="sm"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {user?.preferred_username}
              </MenuButton>
              <MenuList zIndex={2}>
                <Box px={2} textAlign="right">
                  <Text>{user?.name}</Text>
                  <Text fontSize="sm">{user?.organization}</Text>
                </Box>
                <MenuDivider />
                <MenuItem
                  onClick={async () => await auth.authorization?.revoke()}
                >
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </>
      ) : (
        <Button
          size="sm"
          onClick={() => auth.authorization?.login()}
          colorScheme="blue"
        >
          Sign In
        </Button>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Flex
      as="header"
      bg="brand.800"
      minH={{ base: "50px", md: "10vh" }}
      align={"center"}
      justify={"center"}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          minWidth="max-content"
          alignItems={{ base: "flex-start", md: "center" }}
          justify={{ base: "space-around", md: "space-between" }}
          my={2}
        >
          <Box>
            <Link href="/">
              <HStack py={4} spacing="24px">
                {LOGO && (
                  <Image
                    src={LOGO.src}
                    alt={LOGO.alt}
                    boxSize="100px"
                    objectFit="contain"
                  />
                )}
                <Heading as="h1" size="md" color="white">
                  {HEADLINE}
                </Heading>
              </HStack>
            </Link>
          </Box>
          {withFeature("authentication", () => (
            <Box>
              <Authentication />
            </Box>
          ))}
        </Flex>
      </Container>
    </Flex>
  );
}
