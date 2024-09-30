"use context";
import React, {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
} from "react";
import { Static, getAttribute } from "../../static";

import type { GFacetResult } from "@globus/sdk/services/search/service/query";

const FACETS = getAttribute("globus.search.facets", []);
type Facet = NonNullable<
  Static["data"]["attributes"]["globus"]["search"]["facets"]
>[0];
/**
 * Since a `GFacet` can be expressed with or without a `name`, when
 * when processing a `GFacetResult` to map to a `GFilter`, we need to
 * figure out what the configured `field_name` is for the facet.
 */
export function getFacetFieldNameByName(name: string) {
  let match = FACETS.find((facet: Facet) => facet.name === name)?.field_name;
  if (!match) {
    match = FACETS.find(
      (facet: Facet) => facet.field_name === name,
    )?.field_name;
  }
  return match;
}

export type SearchState = {
  limit: number;
  offset: number;
  facetFilters: Record<string, any>;
};

type SearchAction =
  | {
      type: "set_facet_filter";
      payload: {
        facet: GFacetResult;
        value: string[];
      };
    }
  | {
      type: "reset_facet_filters";
    }
  | {
      type: "set_limit";
      payload: number;
    }
  | {
      type: "set_offset";
      payload: number;
    };

function searchReducer(state: SearchState, action: SearchAction) {
  switch (action.type) {
    case "set_limit":
      return { ...state, limit: action.payload, offset: 0 };
    case "set_offset":
      return { ...state, offset: action.payload };
    case "set_facet_filter": {
      const fieldName = getFacetFieldNameByName(action.payload.facet.name);
      const { facetFilters } = state;
      /**
       * If the incoming value is empty, remove the filter from the state.
       */
      if (action.payload.value.length === 0 && facetFilters[fieldName]) {
        const { [fieldName]: _, ...rest } = facetFilters;
        return { ...state, facetFilters: rest };
      }
      /**
       * Otherwise, update the filter in the state to the provided value.
       */
      return {
        ...state,
        facetFilters: {
          ...facetFilters,
          [fieldName]: {
            type: "match_any",
            field_name: fieldName,
            values: action.payload.value,
          },
        },
      };
    }
    case "reset_facet_filters":
      return { ...state, facetFilters: initialState.facetFilters };
    default:
      return state;
  }
}

const initialState: SearchState = {
  limit: 25,
  offset: 0,
  facetFilters: {},
};

const SearchContext = createContext(initialState);
const SearchDispatchContext = createContext<Dispatch<SearchAction>>(() => {});

export default function SearchProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [search, dispatch] = useReducer(searchReducer, initialState);
  return (
    <SearchContext.Provider value={search}>
      <SearchDispatchContext.Provider value={dispatch}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}

export function useSearchDispatch() {
  return useContext(SearchDispatchContext);
}
