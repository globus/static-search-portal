import React from "react";

import { Container } from "@chakra-ui/react";

import SearchProvider from "../providers/search-provider";
import { Search } from "@/components/Search";
import { RequireAuthentication } from "@/components/RequireAuthentication";

export default function SearchPage() {
  return (
    <>
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
