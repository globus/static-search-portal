"use client";
import React, { ChangeEvent } from "react";
import {
  Box,
  Button,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Flex,
  Spacer,
  BoxProps,
  HStack,
  MenuDivider,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  useMenuItem,
  InputProps,
  UseMenuItemProps,
  Icon,
  Text,
  Tag,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAttribute } from "../../static";

import {
  getFacetFieldNameByName,
  useSearchDispatch,
  useSearch,
} from "@/providers/search-provider";

import type {
  GSearchResult,
  GFacetResult,
} from "@globus/sdk/services/search/service/query";

const FACETS = getAttribute("globus.search.facets", []);
const navigationKeys = ["ArrowUp", "ArrowDown", "Escape"];
const BucketSearch = (props: UseMenuItemProps & InputProps) => {
  const { role, ...rest } = useMenuItem(props);
  return (
    <Box role={role}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={MagnifyingGlassIcon} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          variant="flush"
          {...rest}
          type="search"
          onKeyDown={(e) => {
            if (!navigationKeys.includes(e.key)) {
              e.stopPropagation();
            }
          }}
        />
      </InputGroup>
    </Box>
  );
};

function FacetMenu({ facet }: { facet: GFacetResult }) {
  const dispatch = useSearchDispatch();
  const search = useSearch();
  const [filter, setFilter] = React.useState("");

  const fieldName = getFacetFieldNameByName(facet.name);
  const value = search.facetFilters[fieldName]?.values || [];
  const handleChange = (value: string | string[]) => {
    dispatch({
      type: "set_facet_filter",
      payload: {
        facet,
        value: Array.isArray(value) ? value : [value],
      },
    });
  };

  const buckets = filter
    ? facet.buckets?.filter((b) => {
        return (
          JSON.stringify(b.value)
            .toLowerCase()
            .indexOf(filter.toLowerCase()) !== -1
        );
      })
    : facet.buckets;

  return (
    <Menu closeOnSelect={false} autoSelect={false}>
      <MenuButton
        as={Button}
        size="sm"
        leftIcon={<Icon as={PlusCircleIcon} />}
        variant="ghost"
        border="1px dashed"
        borderColor="gray.400"
        p={1}
      >
        <HStack>
          <Text>{facet.name}</Text>
          {value.length > 0 &&
            value.length <= 2 &&
            value.map((v: string) => (
              <Box key={v}>
                <Tag size="sm">{v}</Tag>
              </Box>
            ))}
          {value.length > 2 && <Tag size="sm">{value.length} selected</Tag>}
        </HStack>
      </MenuButton>
      <MenuList p={0}>
        <BucketSearch
          isDisabled={buckets?.length === 0 && !filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilter(e.target.value)
          }
        />

        {buckets?.length === 0 && (
          <MenuItem justifyContent="center" isDisabled>
            No results found.
          </MenuItem>
        )}

        <MenuOptionGroup onChange={handleChange} value={value} type="checkbox">
          {buckets?.map((bucket) => {
            const valueAsString =
              typeof bucket.value === "string"
                ? bucket.value
                : JSON.stringify(bucket.value);
            return (
              <MenuItemOption key={valueAsString} value={valueAsString}>
                <Flex align="center">
                  {valueAsString === "" ? (
                    <Text as="i">(Not Set)</Text>
                  ) : (
                    valueAsString
                  )}
                  <Spacer />
                  <Badge ml={2}>{bucket.count}</Badge>
                </Flex>
              </MenuItemOption>
            );
          })}
        </MenuOptionGroup>
        {value.length > 0 && (
          <>
            <MenuDivider />
            <MenuItem justifyContent="center" onClick={() => handleChange([])}>
              Clear Filters
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}

export default function SearchFacets({
  result,
  ...rest
}: {
  result?: GSearchResult;
} & BoxProps) {
  const dispatch = useSearchDispatch();
  const search = useSearch();

  if (FACETS.length === 0 || !result || !result.facet_results) {
    return null;
  }

  const hasFacetFilters = Object.keys(search.facetFilters).length > 0;

  const reset = () => {
    dispatch({ type: "reset_facet_filters" });
  };

  return (
    <Box {...rest}>
      <Wrap>
        {result.facet_results.map((facet, i) => (
          <WrapItem key={i}>
            <FacetMenu facet={facet} />
          </WrapItem>
        ))}
      </Wrap>
      {hasFacetFilters && (
        <Button
          mt={2}
          size="xs"
          onClick={reset}
          variant="ghost"
          leftIcon={<Icon as={XMarkIcon} />}
        >
          Clear All Filters
        </Button>
      )}
    </Box>
  );
}
