import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  replaceWith: string;
};

type Action = {
  setReplaceWith: (path: string) => void;
  reset: () => void;
};

const initialState = {
  replaceWith: "/",
};

export const useOAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      setReplaceWith: (replaceWith: string) => {
        return set((state) => ({
          ...state,
          replaceWith,
        }));
      },
      reset: () => {
        return set(initialState);
      },
    }),
    {
      name: "oauth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
