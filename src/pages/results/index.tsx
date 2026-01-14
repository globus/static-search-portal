import React from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { ChevronLeft } from "lucide-react";
import { Divider, Button } from "@mantine/core";
import { Icon } from "@/components/private/Icon";

import { ClientSideResult } from "@/components/ClientSideResult";
import { RequireAuthentication } from "@/components/RequireAuthentication";
import Head from "next/head";

import { getMetadata } from "../../../static-lib";

/**
 * The `/results` route uses client-side rendering exclusively in order to support the static export of
 * the portal by default. For portals that require result pages to be pre-rendered at build time, we will
 * introduce `areSEOResultsEnabled` and utilize `/results/[subject]` instead.
 */
export default function ResultPage() {
  const router = useRouter();
  const subject = Array.isArray(router.query.subject)
    ? router.query.subject[0]
    : router.query.subject;

  const title = `${getMetadata().title} | Results | ${subject}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>
      <RequireAuthentication>
        <Button
          component={NextLink}
          href="/search"
          leftSection={<Icon component={ChevronLeft} />}
          size="xs"
          variant="subtle"
        >
          Back to Search
        </Button>
        <Divider my="xs" />
        {subject && <ClientSideResult subject={subject} />}
      </RequireAuthentication>
    </>
  );
}
