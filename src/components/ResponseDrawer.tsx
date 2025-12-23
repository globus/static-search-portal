import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer } from "@mantine/core";

export default function ResponseDrawer({ children }: { children: any }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button variant="subtle" onClick={open} size="xs">
        View Raw Search Result
      </Button>
      <Drawer
        title="Raw Search Result"
        opened={opened}
        position="right"
        onClose={close}
        size="xl"
      >
        {children}
      </Drawer>
    </>
  );
}
