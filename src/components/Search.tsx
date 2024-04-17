"use client";
import {
  InputGroup,
  Input,
  Box,
  VStack,
  InputLeftElement,
  useToast,
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
import { Pagination } from "./Pagination";

const SEARCH_INDEX = getAttribute("globus.search.index");
const FACETS = getAttribute("globus.search.facets", []);

function getSearchPayload(query: string, state: SearchState) {
  return {
    q: query,
    facets: FACETS,
    offset: state.offset,
    limit: state.limit,
    filters: Object.values(state.facetFilters).filter((f) => Boolean(f)),
  };
}

export function Search() {
  const search = useSearch();
  const toast = useToast({
    position: "bottom-right",
  });
  const toastId = "search-status";
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<undefined | GSearchResult>();

  useEffect(() => {
    const fetchResults = throttle(async () => {
      const id = toast({
        id: toastId,
        title: "Fetching search results...",
        status: "loading",
        duration: null,
      });
      const response = await gsearch.query.post(SEARCH_INDEX, {
        payload: getSearchPayload(query, search),
      });
      const results = await response.json();
      setResult(results);
      toast.close(id);
    }, 1000);
    fetchResults();
  }, [query, search]);

  return (
    <>
      <Box py={2} position="sticky" top={0} backgroundColor="white" zIndex={1}>
        <VStack spacing={2} align="stretch">
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
          <SearchFacets result={result} />
          <Pagination result={result} />
        </VStack>
      </Box>
      <Box>
        <Box p={4}>
          {isGError(result) && <Error error={result} />}
          {result && result.total > 0 && (
            <>
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
    </>
  );
}
