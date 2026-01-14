import { Group, Anchor, Button, Text, Avatar, Menu } from "@mantine/core";
import { AnchorExternal } from "./private/AnchorExternal";
import NextLink from "next/link";
import { useGlobusAuth } from "@globus/react-auth-context";
import { z } from "zod";

import { getStatic, withFeature } from "@from-static/generator-kit";
import TransferDrawer from "./Transfer/Drawer";
import { useLogin } from "@/hooks/useOAuth";

const NavigationItemSchema = z.union([
  z.object({
    label: z.string(),
    to: z.string(),
    authenticated: z.boolean().optional(),
  }),
  z.object({
    label: z.string(),
    href: z.string(),
    authenticated: z.boolean().optional(),
  }),
]);

export const NavigationOptionsSchema = z.object({
  items: z.array(NavigationItemSchema),
});

export type NavigationItem = z.infer<typeof NavigationItemSchema>;

export type NavigationOptions = z.infer<typeof NavigationOptionsSchema>;

const DEFAULT_NAVIGATION: NavigationOptions = {
  items: [
    {
      label: "Search",
      to: "/search",
    },
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
  const nav = {
    ...(getStatic().data.attributes.content?.navigation || {}),
    items: [
      ...(getStatic().data.attributes.content?.navigation?.items || []),
      ...DEFAULT_NAVIGATION.items,
    ],
  };
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
