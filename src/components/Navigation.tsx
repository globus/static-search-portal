import React from "react";
import { Group, Anchor, Button, Text, Avatar, Menu, Box } from "@mantine/core";
import { AnchorExternal } from "./private/AnchorExternal";
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
      <Anchor component={NextLink} href={props.to}>
        {props.label}
      </Anchor>
    );
  }

  /**
   * @todo This should probably check the hostname, not just the protocol.
   */
  const isExternal = props.href.startsWith("http");
  if (!isExternal) {
    return <Anchor href={props.href}>{props.label}</Anchor>;
  }

  return <AnchorExternal href={props.href}>{props.label}</AnchorExternal>;
};

export default function Navigation() {
  const auth = useGlobusAuth();
  const nav = NAVIGATION;
  return (
    <Group fz="md">
      <Group py={2} px={4}>
        <Group component="nav" gap="xs">
          {nav.items
            .filter((item) => {
              if (!item.authenticated) {
                return true;
              }
              return auth.isAuthenticated;
            })
            .map((item, index) => (
              <NavigationItemLink key={index} {...item} />
            ))}
        </Group>
        {withFeature("authentication", () => (
          <Authentication />
        ))}
      </Group>
    </Group>
  );
}

export function Authentication() {
  const auth = useGlobusAuth();
  const login = useLogin();
  const user = auth.authorization?.user;
  return (
    <>
      {auth.isAuthenticated && user ? (
        <Group component="nav" gap="xs">
          <TransferDrawer />
          <Menu
            withArrow
            width={300}
            position="bottom"
            transitionProps={{ transition: "pop" }}
            withinPortal
          >
            <Menu.Target>
              <Button size="sm">{user.preferred_username}</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Group gap="sm" px="xs" py="sm">
                <Avatar radius="xs" name={user.name} color="initials" />
                <div>
                  <Text fw={500}>{user.name}</Text>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                  <Text fz="xs">{user.organization}</Text>
                </div>
              </Group>
              <Menu.Item
                onClick={async () => await auth.authorization?.revoke()}
              >
                Log Out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      ) : (
        <Button size="sm" onClick={login}>
          Sign In
        </Button>
      )}
    </>
  );
}
