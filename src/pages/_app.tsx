import React, { PropsWithChildren, useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "../providers/theme-provider";
import { info } from "@globus/sdk";

import "@mantine/core/styles.css";

import {
  getEnvironment,
  getRedirectUri,
  getAttribute,
  isTransferEnabled,
  isAuthenticationEnabled,
  isFeatureEnabled,
  METADATA,
} from "../../static";

import {
  Provider as GlobusAuthorizationManagerProvider,
  useGlobusAuth,
} from "@globus/react-auth-context";
import { CLIENT_INFO } from "@/globus/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Head from "next/head";

const env = getEnvironment();
if (env) {
  // @ts-ignore
  globalThis.GLOBUS_SDK_ENVIRONMENT = env;
}

info.addClientInfo(CLIENT_INFO);

const redirect = getRedirectUri();
const client = getAttribute("globus.application.client_id");
const storage = isFeatureEnabled("useLocalStorage")
  ? globalThis.localStorage
  : undefined;

const scopes = [
  "urn:globus:auth:scope:search.api.globus.org:search",
  /**
   * If Globus Transfer functionality is enabled, we'll need to ask for the Transfer scope.
   */
  isTransferEnabled
    ? "urn:globus:auth:scope:transfer.api.globus.org:all"
    : null,
]
  .concat(getAttribute("globus.application.scopes", []))
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
    auth?.authorization?.events.revoke.addListener(reset);
    auth?.authorization?.events.authenticated.addListener(reset);
    return () => {
      auth?.authorization?.events.revoke.removeListener(reset);
      auth?.authorization?.events.authenticated.removeListener(reset);
    };
  }, [auth?.authorization]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  if (!isAuthenticationEnabled) {
    return (
      <>
        <Head>
          <title>{METADATA.title}</title>
          <meta property="og:title" content={METADATA.title} key="title" />
          <meta name="description" content={METADATA.description} />
        </Head>
        <ThemeProvider>
          <QueryProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryProvider>
        </ThemeProvider>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{METADATA.title}</title>
        <meta property="og:title" content={METADATA.title} key="title" />
        <meta name="description" content={METADATA.description} />
      </Head>
      <ThemeProvider>
        <GlobusAuthorizationManagerProvider
          redirect={redirect}
          client={client}
          scopes={scopes}
          storage={storage}
        >
          <QueryProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </QueryProvider>
        </GlobusAuthorizationManagerProvider>
      </ThemeProvider>
    </>
  );
}
