"use client";
import React from "react";

import { Container } from "@chakra-ui/react";

import SearchProvider from "./search-provider";
import { Search } from "@/components/Search";

export default function Index() {
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
