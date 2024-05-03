"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { info } from "@globus/sdk/cjs";

import {
  getEnvironment,
  getRedirectUri,
  getAttribute,
  isFeatureEnabled,
  isTransferEnabled,
} from "../../static";

import { Provider as GlobusAuthorizationManagerProvider } from "@globus/react-auth-context";
import Header from "@/components/Header";
import TransferDrawer from "@/components/Transfer/Drawer";
import { CLIENT_INFO } from "@/globus/utils";

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
  isTransferEnabled && "urn:globus:auth:scope:transfer.api.globus.org:all",
].join(" ");

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
            {isTransferEnabled && <TransferDrawer />}
          </GlobusAuthorizationManagerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
