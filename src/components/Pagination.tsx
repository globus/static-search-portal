import React from "react";
import { Icon } from "@chakra-ui/react";
import { Button, Text, Group, Flex, Select } from "@mantine/core";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";

import type { GSearchResult } from "@globus/sdk/services/search/service/query";
import { useSearch, useSearchDispatch } from "@/providers/search-provider";

export const Pagination = ({ result }: { result?: GSearchResult }) => {
  const search = useSearch();
  const dispatch = useSearchDispatch();

  if (!result) {
    return null;
  }

  const start = search.offset > 0 ? search.offset : 1;
  const end = Math.min(search.offset + search.limit, result.total);

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Group>
        <Text fz="xs" component="label" htmlFor="limit">
          Results per page:
        </Text>
        <Select
          id="limit"
          size="xs"
          defaultValue={`${search.limit}`}
          onChange={(value) => {
            dispatch({
              type: "set_limit",
              payload: value ? parseInt(value) : 25,
            });
          }}
          data={[
            { value: "10", label: "10" },
            { value: "25", label: "25" },
            { value: "50", label: "50" },
            { value: "100", label: "100" },
          ]}
        />
      </Group>

      <Group>
        {result.total > 0 ? (
          <Text>
            <Text component="b">
              {start}-{end}
            </Text>{" "}
            of <Text component="b">{result.total}</Text>
          </Text>
        ) : null}
        <Button.Group>
          <Button
            variant="default"
            size="xs"
            disabled={search.offset === 0}
            onClick={() => {
              dispatch({ type: "set_offset", payload: 0 });
            }}
          >
            <Icon as={ChevronDoubleLeftIcon} />
          </Button>
          <Button
            variant="default"
            size="xs"
            disabled={search.offset === 0}
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
            variant="default"
            size="xs"
            disabled={
              !result.total || search.offset + search.limit >= result.total
            }
            onClick={() => {
              dispatch({
                type: "set_offset",
                payload: search.offset + search.limit,
              });
            }}
          >
            <Icon as={ChevronRightIcon} />
          </Button>
        </Button.Group>
      </Group>
    </Flex>
  );
};
