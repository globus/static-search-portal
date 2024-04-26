"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import {
  getEnvironment,
  getRedirectUri,
  getAttribute,
  isFeatureEnabled,
} from "../../static";

import { GlobusAuthorizationManagerProvider } from "@/globus/globus-auth-context/Provider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@chakra-ui/react";

const env = getEnvironment();
if (env) {
  // @ts-ignore
  globalThis.GLOBUS_SDK_ENVIRONMENT = env;
}

const redirect = getRedirectUri();
const client = getAttribute("globus.application.client_id");
const scopes = "urn:globus:auth:scope:search.api.globus.org:search";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFeatureEnabled("authentication")) {
    return (
      <html lang="en">
        <body>
          <ThemeProvider>
            <Header />
            <Box minH="calc(100vh - 2rem)">{children}</Box>
            <Footer />
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
            <Header />
            <Box minH="calc(100vh - 2rem)">{children}</Box>
            <Footer />
          </GlobusAuthorizationManagerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
