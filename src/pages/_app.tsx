import { PropsWithChildren, useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { info } from "@globus/sdk";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ThemeProvider } from "../providers/theme-provider";

import {
  getEnvironment,
  getRedirectUri,
  isTransferEnabled,
  getMetadata,
  getStatic,
  isFeatureEnabled,
  isAuthenticationEnabled,
} from "@from-static/generator-kit";

import { StaticError } from "@from-static/generator-kit/react/StaticError";

import {
  Provider as GlobusAuthorizationManagerProvider,
  useGlobusAuth,
} from "@globus/react-auth-context";
import { CLIENT_INFO } from "@/globus/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Head from "next/head";

declare global {
  var GLOBUS_SDK_ENVIRONMENT: string | undefined;
}

info.addClientInfo(CLIENT_INFO);

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

export function _App({ Component, pageProps }: AppProps) {
  const env = getEnvironment();
  if (env) {
    globalThis.GLOBUS_SDK_ENVIRONMENT = env;
  }

  if (!isAuthenticationEnabled()) {
    return (
      <>
        <Head>
          <title>{getMetadata().title}</title>
          <meta property="og:title" content={getMetadata().title} key="title" />
          <meta name="description" content={getMetadata().description} />
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

  const redirect = getRedirectUri();
  const client = getStatic().data.attributes.globus.application?.client_id;
  const storage = isFeatureEnabled("useLocalStorage")
    ? globalThis.localStorage
    : undefined;

  const scopes = [
    "urn:globus:auth:scope:search.api.globus.org:search",
    /**
     * If Globus Transfer functionality is enabled, we'll need to ask for the Transfer scope.
     */
    isTransferEnabled()
      ? "urn:globus:auth:scope:transfer.api.globus.org:all"
      : null,
  ]
    .concat(getStatic().data.attributes.globus.application?.scopes || [])
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <Head>
        <title>{getMetadata().title}</title>
        <meta property="og:title" content={getMetadata().title} key="title" />
        <meta name="description" content={getMetadata().description} />
      </Head>
      <ThemeProvider>
        {client && redirect && (
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
        )}
      </ThemeProvider>
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <StaticError>
      <_App {...props} />
    </StaticError>
  );
}
