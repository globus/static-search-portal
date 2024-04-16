"use context";
import React, {
  createContext,
  useReducer,
  useContext,
  type Dispatch,
} from "react";
import { Static, getAttribute } from "../../static";
import { GFacetResult } from "./page";

const FACETS = getAttribute("globus.search.facets", []);
type Facet = NonNullable<
  Static["data"]["attributes"]["globus"]["search"]["facets"]
>[0];

export function getFacetFieldNameByName(name: string) {
  let match = FACETS.find((facet: Facet) => facet.name === name)?.field_name;
  if (!match) {
    match = FACETS.find(
      (facet: Facet) => facet.field_name === name,
    )?.field_name;
  }
  return match;
}

type SearchState = {
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
    };

function searchReducer(state: SearchState, action: SearchAction) {
  switch (action.type) {
    case "set_facet_filter": {
      const fieldName = getFacetFieldNameByName(action.payload.facet.name);
      let filter;
      if (action.payload.value.length !== 0) {
        filter = {
          type: "match_any",
          field_name: fieldName,
          values: action.payload.value,
        };
      }
      return {
        ...state,
        facetFilters: { ...state.facetFilters, [fieldName]: filter },
      };
    }
    case "reset_facet_filters":
      return { ...state, facetFilters: initialState.facetFilters };
    default:
      return state;
  }
}

const initialState: SearchState = {
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
