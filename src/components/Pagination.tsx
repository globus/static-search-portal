import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";

import type { GSearchResult } from "@/globus/search";
import { useSearch, useSearchDispatch } from "@/app/search-provider";

export const Pagination = ({ result }: { result?: GSearchResult }) => {
  const search = useSearch();
  const dispatch = useSearchDispatch();

  if (!result) {
    return null;
  }

  return (
    <Flex align="center" p={2}>
      <HStack>
        <Text fontSize="sm" as="label" htmlFor="limit">
          Results per page:
        </Text>
        <Box>
          <Select
            id="limit"
            size="sm"
            value={search.limit}
            onChange={(e) => {
              dispatch({
                type: "set_limit",
                payload: parseInt(e.target.value),
              });
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        </Box>
      </HStack>
      <Spacer />
      <Text fontSize="xs">
        {search.offset > 0 ? search.offset : 1}-{search.offset + search.limit}{" "}
        of {result.total}
      </Text>
      <Spacer />
      <ButtonGroup variant="outline" spacing="6">
        <Button
          size="sm"
          isDisabled={search.offset === 0}
          onClick={() => {
            dispatch({ type: "set_offset", payload: 0 });
          }}
        >
          <Icon as={ChevronDoubleLeftIcon} />
        </Button>
        <Button
          size="sm"
          isDisabled={search.offset === 0}
          onClick={() => {
            dispatch({
              type: "set_offset",
              payload: search.offset - search.limit,
            });
          }}
        >
          <Icon as={ChevronLeftIcon} />
        </Button>

        <Button
          size="sm"
          onClick={() => {
            dispatch({
              type: "set_offset",
              payload: search.offset + search.limit,
            });
          }}
        >
          <Icon as={ChevronRightIcon} />
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
