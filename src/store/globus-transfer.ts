import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type transfer } from "@globus/sdk";

/**
 * @see https://docs.globus.org/api/transfer/endpoints_and_collections/#endpoint_or_collection_document
 */
export type Collection = Awaited<
  ReturnType<Awaited<ReturnType<typeof transfer.endpoint.get>>["json"]>
>;

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
  destination?: Collection | { id: string };
  path?: string;
  label?: string;
};

type State = {
  items: Item[];
  transfer?: Transfer;
};

type Actions = {
  setLabel: (label: string) => void;
  setDestination: (destination: Transfer["destination"]) => void;
  setPath: (path: string) => void;
  removeItemBySubject: (subject: Item["subject"]) => void;
  addItem: (item: Item) => void;
  reset: () => void;
  resetTransferSettings: () => void;
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
      setDestination: (destination: Transfer["destination"]) => {
        return set((state) => ({
          ...state,
          transfer: {
            ...state.transfer,
            destination,
          },
        }));
      },
      setPath: (path: Transfer["path"]) => {
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
      /**
       * Preserves the items selected for transfer but resets the settings.
       */
      resetTransferSettings: () => {
        return set((state) => ({
          ...state,
          transfer: undefined,
        }));
      },
      reset: () => {
        return set(initialState);
      },
    }),
    {
      name: "globus-transfer",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
