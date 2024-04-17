"use client";
import {
  HStack,
  InputGroup,
  Input,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { throttle, debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { search as gsearch } from "@globus/sdk";

import { GSearchResult, isGError } from "@/globus/search";

import SearchFacets from "./SearchFacets";
import { SearchState, useSearch } from "../app/search-provider";
import { getAttribute } from "../../static";
import ResultListing from "./ResultListing";
import { Error } from "./Error";

const SEARCH_INDEX = getAttribute("globus.search.index");
const FACETS = getAttribute("globus.search.facets", []);

function getSearchPayload(query: string, state: SearchState) {
  return {
    q: query,
    facets: FACETS,
    filters: Object.values(state.facetFilters).filter((f) => Boolean(f)),
  };
}

export function Search() {
  const search = useSearch();
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<undefined | GSearchResult>();

  useEffect(() => {
    const fetchResults = throttle(async () => {
      const response = await gsearch.query.post(SEARCH_INDEX, {
        payload: getSearchPayload(query, search),
      });
      const results = await response.json();
      setResult(results);
    }, 1000);
    fetchResults();
  }, [query, search]);

  return (
    <>
      <form>
        <HStack p={4}>
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="search"
              placeholder="Start your search here..."
              onChange={debounce((e) => setQuery(e.target.value), 300)}
            />
          </InputGroup>
        </HStack>
        <SearchFacets result={result} px={4} />
        <Box>
          <Box p={4}>
            {isGError(result) && <Error error={result} />}
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
