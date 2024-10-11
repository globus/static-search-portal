import React from "react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
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
      <Link as={NextLink} href={value}>
        {value}
      </Link>
    );
  }
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={value}
      position="relative"
      pr={4}
      isExternal
    >
      {value}
      <ExternalLinkIcon
        as="sup"
        position="absolute"
        top={0}
        right={0}
        fontSize="xs"
      />
    </Link>
  );
}
