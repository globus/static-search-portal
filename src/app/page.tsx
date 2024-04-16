"use client";
import React from "react";

import { Container, Box, Heading, HStack, Image } from "@chakra-ui/react";

import { getAttribute } from "../../static";

import SearchProvider from "./search-provider";
import { Search } from "@/components/Search";

export type SearchEntry = {
  entry_id: string | null;
  matched_principal_sets: string[];
  content: {
    [key: string]: unknown;
  };
};

export type GMetaResult = {
  "@datatype": "GMetaResult";
  "@version": string;
  subject: string;
  entries: SearchEntry[];
};

export type GBucket = {
  "@datatype": "GBucket";
  "@version": string;
  value: string | Record<string, unknown>;
  count: number;
};

export type GFacetResult = {
  "@datatype": "GFacetResult";
  "@version": string;
  name: string;
  value?: number;
  buckets: GBucket[];
};

export type GSearchResult = {
  "@datatype": "GSearchResult";
  "@version": string;
  offset: number;
  total: number;
  has_next_page: boolean;
  facet_results?: GFacetResult[];
  gmeta: GMetaResult[];
};

export type GError = {
  "@datatype": "GError";
  message: string;
  code: string;
  request_id: string;
  status: number;
  error: Record<string, unknown> | Array<GError>;
};

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
