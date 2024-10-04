import React from "react";

import { Container } from "@chakra-ui/react";

import SearchProvider from "../providers/search-provider";
import { Search } from "@/components/Search";

export default function SearchPage() {
  return (
    <>
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
