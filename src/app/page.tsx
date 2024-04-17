"use client";
import React from "react";

import { Container, Box, Heading, HStack, Image } from "@chakra-ui/react";

import { getAttribute } from "../../static";

import SearchProvider from "./search-provider";
import { Search } from "@/components/Search";

const SEARCH_INDEX = getAttribute("globus.search.index");
const LOGO = getAttribute("content.logo");
const HEADLINE = getAttribute(
  "content.headline",
  `Search Index ${SEARCH_INDEX}`,
);

export default function Index() {
  return (
    <>
      <Box bg="brand.800">
        <HStack p={4} spacing="24px">
          {LOGO && (
            <Image
              src={LOGO.src}
              alt={LOGO.alt}
              boxSize="100px"
              objectFit="contain"
            />
          )}
          <Heading size="md" color="white">
            {HEADLINE}
          </Heading>
        </HStack>
      </Box>
      <Container maxW="container.xl">
        <main>
          <SearchProvider>
            <Search />
          </SearchProvider>
        </main>
      </Container>
    </>
  );
}
