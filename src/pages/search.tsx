import React from "react";
import Head from "next/head";

import { Container } from "@chakra-ui/react";

import SearchProvider from "../providers/search-provider";
import { Search } from "@/components/Search";
import { RequireAuthentication } from "@/components/RequireAuthentication";

import { METADATA } from "../../static";

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>{METADATA.title} | Search</title>
      </Head>
      <Container maxW="container.xl">
        <main>
          <RequireAuthentication>
            <SearchProvider>
              <Search />
            </SearchProvider>
          </RequireAuthentication>
        </main>
      </Container>
    </>
  );
}
