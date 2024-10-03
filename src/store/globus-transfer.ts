import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { Endpoint } from "@/globus/collection-browser/CollectionBrowser";

/**
 * Items that will be transferred to the destination.
 */
export type Item = {
  label: string;
  collection: string;
  path: string;
  subject: string;
  type: "file" | "directory";
};
/**
 * Represents the information required to initiate a Globus transfer of the items.
 */
export type Transfer = {
  destination?: Endpoint;
  path?: string;
  label?: string;
};

type State = {
  items: Item[];
  transfer?: Transfer;
};

type Actions = {
  setLabel: (label: string) => void;
  setDestination: (destination: Endpoint) => void;
  setPath: (path: string) => void;
  removeItemBySubject: (subject: Item["subject"]) => void;
  addItem: (item: Item) => void;
  reset: () => void;
};

const initialState = {
  items: [],
  transfer: undefined,
};

export const useGlobusTransferStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setLabel: (label: string) => {
        return set((state) => ({
          ...state,
          transfer: {
            ...state.transfer,
            label,
          },
        }));
      },
      setDestination: (destination: Endpoint) => {
        return set((state) => ({
          ...state,
          transfer: {
            ...state.transfer,
            destination,
          },
        }));
      },
      setPath: (path: string) => {
        return set((state) => ({
          ...state,
          transfer: {
            ...state.transfer,
            path,
          },
        }));
      },
      addItem: (item) => {
        return set((state) => ({
          ...state,
          items: [...state.items, item],
        }));
      },
      removeItemBySubject: (item) => {
        return set((state) => ({
          ...state,
          items: state.items.filter((i) => i.subject !== item),
        }));
      },
      reset: () => {
        return set(initialState);
      },
    }),
    {
      name: "globus-transfer",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
