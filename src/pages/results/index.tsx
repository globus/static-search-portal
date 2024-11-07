import React from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { Container, Text, Link, Flex, Divider } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import { ClientSideResult } from "@/components/ClientSideResult";
import { RequireAuthentication } from "@/components/RequireAuthentication";
import Head from "next/head";

import { METADATA } from "../../../static";

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

  const title = `${METADATA.title} | Results | ${subject}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>
      <Container maxW="container.xl" p={4}>
        <RequireAuthentication>
          <Link as={NextLink} href="/search">
            <Flex alignItems="center" mb={4}>
              <ChevronLeftIcon /> <Text fontSize="sm">Back</Text>
            </Flex>
          </Link>
          <Divider my={2} />
          {subject && <ClientSideResult subject={subject} />}
        </RequireAuthentication>
      </Container>
    </>
  );
}
