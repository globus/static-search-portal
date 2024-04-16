"use client";
import {
  HStack,
  InputGroup,
  Input,
  Button,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from "@chakra-ui/react";
import React, { FormEvent, useState } from "react";
import SearchFacets from "./SearchFacets";
import { search as gsearch } from "@globus/sdk";
import { useSearch } from "../app/search-provider";
import { GSearchResult } from "../app/page";
import { getAttribute } from "../../static";
import ResultListing from "./ResultListing";

const SEARCH_INDEX = getAttribute("globus.search.index");
const FACETS = getAttribute("globus.search.facets", []);

export function Search() {
  const search = useSearch();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [result, setResult] = useState<undefined | GSearchResult>();

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await gsearch.query.post(SEARCH_INDEX, {
      payload: {
        q: e.currentTarget.q.value,
        facets: FACETS,
        filters: Object.values(search.facetFilters),
      },
    });
    const results = await response.json();
    setResult(results);
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSearchSubmit}>
        <HStack p={4}>
          <InputGroup size="md">
            <Input
              name="q"
              type="search"
              placeholder="Start your search here..."
              ref={inputRef}
            />
          </InputGroup>
          <Button colorScheme="brand" type="submit">
            Search
          </Button>
        </HStack>
        <SearchFacets result={result} px={4} />
        <Box>
          <Box p={4}>
            {result && result.total > 0 && (
              <>
                <Stat size="sm">
                  <StatLabel>Results</StatLabel>
                  <StatNumber>{result.total} datasets found</StatNumber>
                </Stat>
                <VStack py={2} spacing={5} align="stretch">
                  {result.gmeta?.map((gmeta, i) => (
                    <ResultListing key={i} gmeta={gmeta} />
                  ))}
                </VStack>
              </>
            )}
            {result && result.total === 0 && <Box>No datasets found.</Box>}
          </Box>
        </Box>
      </form>
    </>
  );
}
