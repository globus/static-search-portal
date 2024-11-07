import React from "react";
import {
  Box,
  Button,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useGlobusAuth } from "@globus/react-auth-context";

import { STATIC, withFeature } from "../../static";
import TransferDrawer from "./Transfer/Drawer";
import { useLogin } from "@/hooks/useOAuth";

export type NavigationItem =
  | {
      label: string;
      to: string;
      authenticated?: boolean;
    }
  | {
      label: string;
      href: string;
      authenticated?: boolean;
    };

export type NavigationOptions = {
  items: NavigationItem[];
};

const DEFAULT_NAVIGATION: NavigationOptions = {
  items: [
    {
      label: "Search",
      to: "/search",
    },
  ],
};

const NAVIGATION = {
  ...(STATIC.data.attributes.content?.navigation || {}),
  items: [
    ...(STATIC.data.attributes.content?.navigation?.items || []),
    ...DEFAULT_NAVIGATION.items,
  ],
};

const NavigationItemLink = (props: NavigationItem) => {
  if ("to" in props) {
    return (
      <Link as={NextLink} href={props.to}>
        {props.label}
      </Link>
    );
  }

  /**
   * @todo This should probably check the hostname, not just the protocol.
   */
  const isExternal = props.href.startsWith("http");
  if (!isExternal) {
    return <Link href={props.href}>{props.label}</Link>;
  }

  return (
    <Link href={props.href} position="relative" pr={4} isExternal>
      {props.label}{" "}
      <ExternalLinkIcon
        as="sup"
        position="absolute"
        top={0}
        right={0}
        fontSize="xs"
      />
    </Link>
  );
};

export default function Navigation() {
  const auth = useGlobusAuth();
  const nav = NAVIGATION;
  return (
    <HStack justify="space-between" fontSize="md">
      <HStack py={2} px={4}>
        <HStack as="nav" spacing={4} textColor="white">
          {nav.items
            .filter((item) => {
              if (!item.authenticated) {
                return true;
              }
              return auth.isAuthenticated;
            })
            .map((item, index) => (
              <Box key={index} fontWeight={500} p={2}>
                <NavigationItemLink {...item} />
              </Box>
            ))}
        </HStack>
        {withFeature("authentication", () => (
          <Box>
            <Authentication />
          </Box>
        ))}
      </HStack>
    </HStack>
  );
}

export function Authentication() {
  const auth = useGlobusAuth();
  const login = useLogin();
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
        <Button size="sm" onClick={login} colorScheme="blue">
          Sign In
        </Button>
      )}
    </>
  );
}
