"use client";

import React, { PropsWithChildren, useEffect } from "react";
import { ThemeProvider } from "./theme-provider";
import { info } from "@globus/sdk";

import {
  getEnvironment,
  getRedirectUri,
  getAttribute,
  isTransferEnabled,
  isAuthenticationEnabled,
} from "../../static";

import {
  Provider as GlobusAuthorizationManagerProvider,
  useGlobusAuth,
} from "@globus/react-auth-context";
import Header from "@/components/Header";
import { CLIENT_INFO } from "@/globus/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const env = getEnvironment();
if (env) {
  // @ts-ignore
  globalThis.GLOBUS_SDK_ENVIRONMENT = env;
}

info.addClientInfo(CLIENT_INFO);

const redirect = getRedirectUri();
const client = getAttribute("globus.application.client_id");

const scopes = [
  "urn:globus:auth:scope:search.api.globus.org:search",
  /**
   * If Globus Transfer functionality is enabled, we'll need to ask for the Transfer scope.
   */
  isTransferEnabled
    ? "urn:globus:auth:scope:transfer.api.globus.org:all"
    : null,
]
  .filter(Boolean)
  .join(" ");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Many errors encountered during queries need to be manually addressed,
       * so we disable automatic retries by default.
       */
      retry: false,
    },
  },
});
function reset() {
  queryClient.cancelQueries();
  queryClient.removeQueries();
  queryClient.clear();
}

const QueryProvider = ({ children }: PropsWithChildren) => {
  const auth = useGlobusAuth();
  useEffect(() => {
    auth.authorization?.events.revoke.addListener(reset);
    auth.authorization?.events.authenticated.addListener(reset);
    return () => {
      auth.authorization?.events.revoke.removeListener(reset);
      auth.authorization?.events.authenticated.removeListener(reset);
    };
  }, [auth.authorization]);
  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthenticationEnabled) {
    return (
      <html lang="en">
        <body>
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <GlobusAuthorizationManagerProvider
            redirect={redirect}
            client={client}
            scopes={scopes}
          >
            <QueryProvider>
              <Header />
              {children}
            </QueryProvider>
          </GlobusAuthorizationManagerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
