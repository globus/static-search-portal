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

import { useGlobusAuth } from "./../globus/globus-auth-context/useGlobusAuth";
import { getAttribute, withFeature } from "../../static";
import { ChevronDownIcon } from "@chakra-ui/icons";

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
        <Menu placement="bottom-end">
          <MenuButton size="sm" as={Button} rightIcon={<ChevronDownIcon />}>
            {user?.preferred_username}
          </MenuButton>
          <MenuList zIndex={2}>
            <Box px={2} textAlign="right">
              <Text>{user?.name}</Text>
              <Text fontSize="sm">{user?.organization}</Text>
            </Box>
            <MenuDivider />
            <MenuItem onClick={async () => await auth.authorization?.revoke()}>
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
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
    <header>
      <Box bg="brand.800">
        <Container maxW="container.xl">
          <Flex
            minWidth="max-content"
            alignItems="center"
            justify="space-between"
            h="10vh"
          >
            <HStack p={4} spacing="24px">
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
            {withFeature("authentication", () => (
              <Authentication />
            ))}
          </Flex>
        </Container>
      </Box>
    </header>
  );
}
