import React from "react";
import NextLink from "next/link";
import { Anchor } from "@mantine/core";
import { isRelativePath } from "@/utils/path";
import { ExternalLinkIcon } from "@chakra-ui/icons";

type Value = string;

function isValidValue(value: unknown): value is Value {
  return typeof value === "string";
}

/**
 * Render a field as a link.
 */
export default function LinkField({ value }: { value: unknown }) {
  if (!isValidValue(value)) {
    return;
  }
  const isRelative = isRelativePath(value);
  if (isRelative) {
    /**
     * If the link is relative, use Next.js's `Link` component.
     */
    return (
      <Anchor component={NextLink} href={value}>
        {value}
      </Anchor>
    );
  }
  return (
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      href={value}
      pos="relative"
      pr={4}
    >
      {value}
      <ExternalLinkIcon
        as="sup"
        position="absolute"
        top={0}
        right={0}
        fontSize="xs"
      />
    </Anchor>
  );
}
