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
} from "@chakra-ui/react";
import { PlusSquareIcon, SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { getAttribute } from "../../static";

import { GSearchResult, GFacetResult } from "../app/page";
import {
  getFacetFieldNameByName,
  useSearchDispatch,
  useSearch,
} from "@/app/search-provider";

const FACETS = getAttribute("globus.search.facets", []);
const navigationKeys = ["ArrowUp", "ArrowDown", "Escape"];
const BucketSearch = (props: UseMenuItemProps & InputProps) => {
  const { role, ...rest } = useMenuItem(props);
  return (
    <Box role={role}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          variant="flush"
          {...rest}
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
    ? facet.buckets.filter((b) => {
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
        leftIcon={<PlusSquareIcon />}
        variant="ghost"
        border="1px dashed"
        borderColor="gray.400"
      >
        {facet.name}
        {value.length > 0 &&
          value.length <= 2 &&
          value.map((v: string) => (
            <Badge key={v} ml={2}>
              {v}
            </Badge>
          ))}
        {value.length > 2 && <Badge ml={2}>{value.length} selected</Badge>}
      </MenuButton>
      <MenuList p={0}>
        <BucketSearch
          isDisabled={buckets.length === 0 && !filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFilter(e.target.value)
          }
        />

        {buckets.length === 0 && (
          <MenuItem justifyContent="center" isDisabled>
            No results found.
          </MenuItem>
        )}

        <MenuOptionGroup onChange={handleChange} value={value} type="checkbox">
          {buckets.map((bucket) => {
            const valueAsString =
              typeof bucket.value === "string"
                ? bucket.value
                : JSON.stringify(bucket.value);
            return (
              <MenuItemOption key={valueAsString} value={valueAsString}>
                <Flex align="center">
                  {valueAsString}
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
      <HStack>
        {result.facet_results.map((facet, i) => (
          <FacetMenu key={i} facet={facet} />
        ))}
        {hasFacetFilters && (
          <Button
            size="sm"
            onClick={reset}
            variant="ghost"
            rightIcon={<SmallCloseIcon />}
          >
            Clear All Filters
          </Button>
        )}
      </HStack>
    </Box>
  );
}
