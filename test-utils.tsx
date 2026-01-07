import React, { ReactElement } from "react";
import { render as _render, RenderOptions } from "@testing-library/react";
import { Provider as GlobusAuthorizationManagerProvider } from "@globus/react-auth-context";
import { ThemeProvider } from "@/providers/theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobusAuthorizationManagerProvider client="abc" redirect="#">
      <ThemeProvider>{children}</ThemeProvider>
    </GlobusAuthorizationManagerProvider>
  );
};

// eslint-disable-next-line import/export
export * from "@testing-library/react";
// eslint-disable-next-line import/export
export const render = (
  ui: ReactElement<any>,
  options?: Omit<RenderOptions, "wrapper">,
) => {
  return _render(ui, { wrapper: Providers, ...options });
};
