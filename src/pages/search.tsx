import React from "react";
import Head from "next/head";

import { Container } from "@chakra-ui/react";

import SearchProvider from "../providers/search-provider";
import { Search } from "@/components/Search";
import { RequireAuthentication } from "@/components/RequireAuthentication";

import { getAttribute } from "../../static";

const title = getAttribute("metadata.title", "Seearch Portal");

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>{title} | Search</title>
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
