"use client";
import React, { type ComponentProps, useState } from "react";
import { Badge, Icon, Text } from "@chakra-ui/react";
import {
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  useCombobox,
  Button,
  Box,
} from "@mantine/core";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
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

export default function SearchFacets({
  result,
  ...rest
}: {
  result?: GSearchResult;
} & ComponentProps<typeof Box>) {
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
      <Group gap="sm">
        {result.facet_results.map((facet, i) => (
          <FacetCombobox facet={facet} key={i} />
        ))}
      </Group>
      {hasFacetFilters && (
        <Button
          mt={2}
          size="xs"
          onClick={reset}
          variant="outline"
          leftSection={<Icon as={XMarkIcon} />}
        >
          Clear All Filters
        </Button>
      )}
    </Box>
  );
}

const MAX_DISPLAYED_VALUES = 2;

export function FacetCombobox({ facet }: { facet: GFacetResult }) {
  const search = useSearch();
  const dispatch = useSearchDispatch();
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearchQuery("");
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  const fieldName = getFacetFieldNameByName(facet.name);
  const value = search.facetFilters[fieldName]?.values || [];
  const handleValueSelect = (val: string) => {
    const payload = {
      facet,
      value: [] as string[],
    };
    if (value.includes(val)) {
      payload.value = value.filter((v) => v !== val);
    } else {
      payload.value = [...value, val];
    }

    dispatch({
      type: "set_facet_filter",
      payload,
    });
  };

  const handleValueRemove = (val: string) =>
    dispatch({
      type: "set_facet_filter",
      payload: {
        facet,
        value: value.filter((v) => v !== val),
      },
    });

  const values = value
    .slice(
      0,
      MAX_DISPLAYED_VALUES === value.length
        ? MAX_DISPLAYED_VALUES
        : MAX_DISPLAYED_VALUES - 1,
    )
    .map((item) => (
      <Pill
        key={item}
        withRemoveButton
        onRemove={() => handleValueRemove(item)}
      >
        {item}
      </Pill>
    ));

  const buckets = searchQuery
    ? facet.buckets?.filter((b) => {
        return (
          JSON.stringify(b.value)
            .toLowerCase()
            .indexOf(searchQuery.toLowerCase()) !== -1
        );
      })
    : facet.buckets;

  const options = buckets?.map((bucket) => {
    const valueAsString =
      typeof bucket.value === "string"
        ? bucket.value
        : JSON.stringify(bucket.value);
    return (
      <Combobox.Option
        value={valueAsString}
        key={valueAsString}
        active={value.includes(valueAsString)}
      >
        <Group gap="xs" justify="space-between" w="100%">
          <Group gap="xs" align="center">
            {value.includes(valueAsString) ? <CheckIcon size={12} /> : null}
            <Text>{valueAsString}</Text>
          </Group>
          <Badge size="xs">{bucket.count}</Badge>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <Combobox
      store={combobox}
      width={250}
      position="bottom-start"
      withArrow
      withinPortal={false}
      onOptionSubmit={(val) => {
        handleValueSelect(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target withAriaAttributes={false}>
        <PillsInput
          pointer
          onClick={() => combobox.toggleDropdown()}
          aria-label={facet.name}
          variant="unstyled"
        >
          <Pill.Group>
            {value.length > 0 ? (
              <>
                {facet.name}:{values}
                {value.length > MAX_DISPLAYED_VALUES && (
                  <Pill>+{value.length - (MAX_DISPLAYED_VALUES - 1)} more</Pill>
                )}
              </>
            ) : (
              <Button
                leftSection={<Icon as={PlusCircleIcon} />}
                variant="transparent"
                size="xs"
              >
                {facet.name}
              </Button>
            )}
            {/* <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && value.length > 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget> */}
          </Pill.Group>
        </PillsInput>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Search
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          placeholder="Search groceries"
        />
        <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
          {options?.length === 0 ? <Text>No results found.</Text> : options}
        </Combobox.Options>
        <Combobox.Footer>Clear</Combobox.Footer>
      </Combobox.Dropdown>
    </Combobox>
  );
}
