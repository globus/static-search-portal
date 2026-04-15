import { createContext, useContext, PropsWithChildren, useMemo } from "react";
import { StaticConfiguration } from "../schemas/static";
import { isFeatureEnabled } from "../index";

interface StaticAPI<TConfig extends StaticConfiguration> {
  state: {
    preview: boolean;
    config: TConfig;
  };

  helpers: {
    isFeatureEnabled: (...args: Parameters<typeof isFeatureEnabled>) => boolean;
  };
}

const StaticContext = createContext<StaticAPI<StaticConfiguration> | null>(
  null,
);

export function StaticProvider<TConfig extends StaticConfiguration>({
  state,
  children,
}: PropsWithChildren<{
  state: {
    preview?: StaticAPI<TConfig>["state"]["preview"];
    config: TConfig;
  };
}>) {
  const api = useMemo<StaticAPI<TConfig>>(() => {
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

export function useStatic() {
  const context = useContext(StaticContext);
  if (!context) {
    throw new Error("useStatic must be used within a StaticProvider");
  }
  return context;
}
