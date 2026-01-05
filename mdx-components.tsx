import React from "react";
import { Box, Code, Title, Image, Anchor, List, Text } from "@mantine/core";
import { ExternalLink } from "lucide-react";
import NextLink from "next/link";
import type { MDXComponents } from "mdx/types";
import { getAbsoluteURL, isRelativePath } from "./src/utils/path";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ul(props) {
      return <List listStyleType="disc" {...props} />;
    },
    li(props) {
      return <Box component="li" {...props} />;
    },
    pre(props: any) {
      return (
        <Code
          w="100%"
          py={3}
          px={1}
          border="1px solid"
          borderColor="gray"
          borderRadius={2}
          overflowX="auto"
          {...props}
        />
      );
    },
    code(props) {
      return <Code component="code" fz="inherit" {...props} />;
    },
    p(props) {
      return <Text component="p" {...props} />;
    },
    h1(props) {
      return <Title order={1} {...props} />;
    },
    h2(props) {
      return <Title order={2} {...props} />;
    },
    h3(props) {
      return <Title order={3} {...props} />;
    },
    h4(props) {
      return <Title order={4} {...props} />;
    },
    h5(props) {
      return <Title order={5} {...props} />;
    },
    img(props) {
      const { src, alt } = props;
      return <Image {...props} alt={alt || ""} src={getAbsoluteURL(src)} />;
    },
    a({ href, ...rest }) {
      if (!href) {
        return <Anchor {...rest} href="#" />;
      }
      const isRelative = isRelativePath(href);
      if (isRelative) {
        /**
         * If the link is relative, use Next.js's `Link` component.
         */
        return <Anchor {...rest} component={NextLink} href={href} />;
      }
      /**
       * If the link is external, mark it as such.
       */
      return (
        <Anchor
          {...rest}
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          pos="relative"
          pr={4}
        >
          {rest.children}
          <ExternalLink
            as="sup"
            position="absolute"
            top={0}
            right={0}
            fontSize="xs"
          />
        </Anchor>
      );
    },
  };
}
