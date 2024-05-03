import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Item = {
  label: string;
  collection: string;
  path: string;
  subject: string;
  type: "file" | "directory";
};

type State = {
  items: Item[];
};

type Actions = {
  removeItemBySubject: (subject: Item["subject"]) => void;
  addItem: (item: Item) => void;
  reset: () => void;
};

const initialState = {
  items: [],
};

export const useGlobusTransferStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      addItem: (item) => {
        return set((state) => ({
          items: [...state.items, item],
        }));
      },
      removeItemBySubject: (item) => {
        return set((state) => ({
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
