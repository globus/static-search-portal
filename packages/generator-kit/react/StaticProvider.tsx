import { createContext, useContext, PropsWithChildren, useMemo } from "react";
import { StaticConfiguration } from "../schemas/static";
import { isFeatureEnabled } from "../index";

interface StaticAPI {
  state: {
    preview: boolean;
    config: StaticConfiguration;
  };

  helpers: {
    isFeatureEnabled: (...args: Parameters<typeof isFeatureEnabled>) => boolean;
  };
}

const StaticContext = createContext<StaticAPI | null>(null);

export function StaticProvider({
  state,
  children,
}: PropsWithChildren<{
  state: {
    preview?: StaticAPI["state"]["preview"];
    config: StaticAPI["state"]["config"];
  };
}>) {
  const api = useMemo<StaticAPI>(() => {
    return {
      state: {
        preview: state?.preview || false,
        config: state.config,
      },
      helpers: {
        isFeatureEnabled: (...args: Parameters<typeof isFeatureEnabled>) =>
          isFeatureEnabled(...args),
      },
    };
  }, [state]);
  return (
    <StaticContext.Provider value={api}>{children}</StaticContext.Provider>
  );
}

export function useStatic(): StaticAPI {
  const context = useContext(StaticContext);
  if (!context) {
    throw new Error("useStatic must be used within a StaticProvider");
  }
  return context;
}
