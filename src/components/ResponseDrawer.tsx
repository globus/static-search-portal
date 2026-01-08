import { useDisclosure } from "@mantine/hooks";
import { Button, Drawer } from "@mantine/core";
import { PropsWithChildren } from "react";

export default function ResponseDrawer({ children }: PropsWithChildren) {
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
