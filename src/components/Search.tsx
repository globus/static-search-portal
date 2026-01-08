"use client";

import {
  TextInput,
  Stack,
  Group,
  Checkbox,
  Paper,
  Box,
  Text,
  Center,
  Title,
  Code,
  Popover,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { SearchIcon, CircleQuestionMark } from "lucide-react";
import { throttle, debounce } from "lodash";
import { useEffect, useState } from "react";
import { search as gsearch } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";
import type {
  GSearchRequest,
  GSearchResult,
} from "@globus/sdk/services/search/service/query";

import { isGError } from "@/globus/search";
import SearchFacets from "./SearchFacets";
import { STATIC, isAuthenticationEnabled } from "../../static";
import ResultListing from "./ResultListing";
import { Error } from "./Error";
import { Pagination } from "./Pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { AnchorExternal } from "./private/AnchorExternal";
import { Icon } from "./private/Icon";
import { SearchState, useSearchContext } from "@/store/search";

const SEARCH_INDEX = STATIC.data.attributes.globus.search.index;
const FACETS = STATIC.data.attributes.globus.search.facets || [];

function getSearchPayload(
  query: string,
  state: SearchState["context"],
): GSearchRequest {
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
  const search = useSearchContext();
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
      <Paper
        pos="sticky"
        top={0}
        withBorder
        p="sm"
        style={{
          zIndex: 1,
        }}
      >
        <Stack gap="xs">
          <TextInput
            leftSection={<Icon component={SearchIcon} />}
            defaultValue={initialQuery}
            type="search"
            placeholder="Start your search here..."
            onChange={debounce((e) => {
              router.push({ query: { ...router.query, q: e.target.value } });
              setQuery(e.target.value);
            }, 300)}
          />
          <Group gap="xs">
            <Checkbox
              defaultChecked={isAdvanced}
              onChange={(e) => {
                router.push({
                  query: {
                    ...router.query,
                    advanced: e.target.checked,
                  },
                });
                setIsAdvanced(e.target.checked);
              }}
              label="Use Advanced Search"
              size="xs"
            />
            <Popover withArrow position="top" width={260}>
              <Popover.Target>
                <ActionIcon
                  aria-label="Learn More about Advanced Search"
                  variant="subtle"
                  color="gray"
                >
                  <Icon component={CircleQuestionMark} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap="xs">
                  <Title order={6}>Using Advanced Search</Title>
                  <Text fz="sm">
                    Your query will be sent to Globus Search as an advanced
                    query and will need to comply with the Globus Search
                    advanced query syntax.
                  </Text>
                  <Text fz="xs" py={2}>
                    <Code>field:value OR field:other</Code>
                  </Text>
                  <AnchorExternal
                    fz="sm"
                    href="https://docs.globus.org/api/search/query/#advanced_query_string_syntax"
                  >
                    Globus Search Documentation
                  </AnchorExternal>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
          <SearchFacets result={result} />
          <Pagination result={result} />
          {isLoading && (
            <Center>
              <Group gap="xs">
                <Loader size="sm" />
                <Text fz="sm">Fetching results...</Text>
              </Group>
            </Center>
          )}
        </Stack>
      </Paper>
      <Box py="xs">
        {isGError(result) && <Error error={result} />}
        {result && result.total > 0 && (
          <Stack py="xs" align="stretch">
            {result.gmeta?.map((gmeta) => (
              <ResultListing key={gmeta.subject} gmeta={gmeta} />
            ))}
          </Stack>
        )}
        {result && result.total === 0 && <Box>No datasets found.</Box>}
      </Box>
    </>
  );
}
