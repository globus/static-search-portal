"use client";

import {
  InputGroup,
  Input,
  Box,
  VStack,
  InputLeftElement,
  Spinner,
  HStack,
  Text,
  Center,
  Checkbox,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon, QuestionIcon } from "@chakra-ui/icons";
import { throttle, debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { search as gsearch } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";
import type { GSearchResult } from "@globus/sdk/services/search/service/query";

import { isGError } from "@/globus/search";
import SearchFacets from "./SearchFacets";
import { SearchState, useSearch } from "../providers/search-provider";
import { getAttribute, isAuthenticationEnabled } from "../../static";
import ResultListing from "./ResultListing";
import { Error } from "./Error";
import { Pagination } from "./Pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

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
  const auth = useGlobusAuth();
  const router = useRouter();
  const search = useSearch();
  const params = useSearchParams();

  const initialQuery = params.get("q") || "";
  const [isAdvanced, setIsAdvanced] = useState(
    params.get("advanced") === "true",
  );
  const [query, setQuery] = useState<string>(initialQuery);
  const [result, setResult] = useState<undefined | GSearchResult>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = throttle(async () => {
      setIsLoading(true);

      const headers =
        isAuthenticationEnabled &&
        auth.isAuthenticated &&
        auth.authorization?.tokens?.search?.access_token
          ? {
              Authorization: `Bearer ${auth.authorization.tokens.search.access_token}`,
            }
          : undefined;
      const response = await gsearch.query.post(SEARCH_INDEX, {
        payload: {
          ...getSearchPayload(query, search),
          advanced: isAdvanced,
        },
        headers,
      });
      const results = await response.json();
      setResult(results);
      setIsLoading(false);
    }, 1000);
    fetchResults();
    return () => fetchResults.cancel();
  }, [
    query,
    search,
    isAdvanced,
    isAuthenticationEnabled
      ? auth.authorization?.tokens?.search?.access_token
      : undefined,
  ]);

  return (
    <>
      <Box py={2} position="sticky" top={0} backgroundColor="white" zIndex={1}>
        <VStack spacing={2} align="stretch">
          <InputGroup size="md">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              defaultValue={initialQuery}
              type="search"
              placeholder="Start your search here..."
              onChange={debounce((e) => {
                router.push({ query: { ...router.query, q: e.target.value } });
                setQuery(e.target.value);
              }, 300)}
            />
          </InputGroup>
          <HStack>
            <Checkbox
              size="sm"
              isChecked={isAdvanced}
              onChange={(e) => {
                router.push({
                  query: {
                    ...router.query,
                    advanced: e.target.checked,
                  },
                });
                setIsAdvanced(e.target.checked);
              }}
            >
              Use Advanced Search
            </Checkbox>
            <Tooltip label="Your query will be sent to Globus Search as an advanced query and will need to comply with the Globus Search advanced query syntax.">
              <Icon as={QuestionIcon} />
            </Tooltip>
          </HStack>
          <SearchFacets result={result} />
          <Pagination result={result} />
          {isLoading && (
            <Center>
              <HStack>
                <Spinner size="sm" />{" "}
                <Text fontSize="sm">Fetching results...</Text>
              </HStack>
            </Center>
          )}
        </VStack>
      </Box>
      <Box>
        <Box p={4}>
          {isGError(result) && <Error error={result} />}
          {result && result.total > 0 && (
            <>
              <VStack py={2} spacing={5} align="stretch">
                {result.gmeta?.map((gmeta, i) => (
                  <ResultListing key={gmeta.subject} gmeta={gmeta} />
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
