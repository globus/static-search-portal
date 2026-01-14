import { create } from "zustand";

import { getStatic } from "../../static-lib";

import type { GFacetResult } from "@globus/sdk/services/search/service/query";

const FACETS = getStatic().data.attributes.globus.search.facets || [];

/**
 * Since a `GFacet` can be expressed with or without a `name`, when
 * when processing a `GFacetResult` to map to a `GFilter`, we need to
 * figure out what the configured `field_name` is for the facet.
 */
export function getFacetFieldNameByName(name: string) {
  let match = FACETS.find((facet) => facet.name === name)?.field_name;
  if (!match) {
    match = FACETS.find((facet) => facet.field_name === name)?.field_name;
  }
  return match;
}

export type SearchState = {
  context: {
    limit: number;
    offset: number;
    facetFilters: Record<
      string,
      {
        type: "match_any";
        field_name: string;
        values: string[];
      }
    >;
  };
  actions: {
    setLimit: (limit: number) => void;
    setOffset: (offset: number) => void;
    setFacetFilter: (facet: GFacetResult, value: string[]) => void;
    resetFacetFilters: () => void;
  };
};

export const useSearchStore = create<SearchState>()((set) => ({
  context: {
    limit: 25,
    offset: 0,
    facetFilters: {},
  },
  actions: {
    setLimit: (limit: number) =>
      set((state) => ({
        context: {
          ...state.context,
          limit,
          offset: 0,
        },
      })),
    setOffset: (offset: number) =>
      set((state) => ({
        context: {
          ...state.context,
          offset,
        },
      })),
    setFacetFilter: (facet: GFacetResult, value: string[]) =>
      set((state) => {
        const fieldName = getFacetFieldNameByName(facet.name);
        if (!fieldName) {
          return state;
        }
        const { facetFilters } = state.context;
        if (value.length === 0 && facetFilters[fieldName]) {
          const { [fieldName]: _, ...rest } = facetFilters;
          return {
            context: {
              ...state.context,
              facetFilters: rest,
            },
          };
        }

        return {
          context: {
            ...state.context,
            facetFilters: {
              ...facetFilters,
              [fieldName]: {
                type: "match_any",
                field_name: fieldName,
                values: value,
              },
            },
          },
        };
      }),
    resetFacetFilters: () =>
      set((state) => ({
        context: {
          ...state.context,
          facetFilters: {},
        },
      })),
  },
}));

export function useSearchContext() {
  return useSearchStore((state) => state.context);
}

export function useSearchActions() {
  return useSearchStore((state) => state.actions);
}
