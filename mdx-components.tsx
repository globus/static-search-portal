import React from "react";
import { Code, Title, Image, List, Text, Anchor } from "@mantine/core";
import { AnchorExternal } from "@/components/private/AnchorExternal";
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
      return <List.Item component="li" {...props} />;
    },
    pre(props) {
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
      return <AnchorExternal {...rest}>{rest.children}</AnchorExternal>;
    },
  };
}
