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
            <Header />
            {children}
          </GlobusAuthorizationManagerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
