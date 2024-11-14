import React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import { getAttribute } from "../../static";

/**
 * Content Security Policy (CSP) for the portal. This policy attempts to be as strict as possible,
 * while ensuring Next.js functionality and common customizations.
 *
 * @see https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy#without-nonces
 */
const DEFALUT_CSP = `
    default-src 'self';
    connect-src 'self' https://*.globus.org https://*.globuscs.info https://*.globusonline.org;
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' https:;
    object-src 'self' blob:;
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
`;

const CSP = getAttribute("contentSecurityPolicy", DEFALUT_CSP);

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {CSP !== false && (
          <meta httpEquiv="Content-Security-Policy" content={CSP} />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
