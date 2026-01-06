import React, { forwardRef } from "react";
import { Box, Group, Anchor, AnchorProps } from "@mantine/core";
import { ExternalLinkIcon } from "lucide-react";

export interface AnchorExternalProps
  extends AnchorProps,
    Omit<
      React.ComponentPropsWithoutRef<"a">,
      keyof AnchorProps | "rel" | "target"
    > {}

export const AnchorExternal = forwardRef<
  HTMLAnchorElement,
  AnchorExternalProps
>(({ ...props }, ref) => {
  return (
    <Anchor {...props} ref={ref} target="_blank" rel="noopener noreferrer">
      <Group pos="relative" w="fit-content">
        {props.children}
        <Box component="sup" pos="absolute" top={-2} right={-12}>
          <ExternalLinkIcon size={12} />
        </Box>
      </Group>
    </Anchor>
  );
});

AnchorExternal.displayName = "AnchorExternal";
