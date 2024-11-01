import React from "react";
import { useRouter } from "next/router";
import { Container, Text, Link, Flex, Divider } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import { ClientSideResult } from "@/components/ClientSideResult";

import type { GetStaticPaths, GetStaticProps } from "next";
import { RequireAuthentication } from "@/components/RequireAuthentication";

/**
 * @todo This page implementaiton and `getStaticPaths` should use the `areSEOResultsEnabled` flag to
 * determine if a list of results paths should be generated at build time. For now, this route
 * exists as a bit of a fallback for existing portals, but will result in 404s when hard-refreshed.
 */
export default function ResultPage() {
  const router = useRouter();
  const subject = Array.isArray(router.query.subject)
    ? router.query.subject[0]
    : router.query.subject;
  return (
    <Container maxW="container.xl" p={4}>
      <RequireAuthentication>
        <Link onClick={() => router.back()}>
          <Flex alignItems="center" mb={4}>
            <ChevronLeftIcon /> <Text fontSize="sm">Back</Text>
          </Flex>
        </Link>
        <Divider my={2} />
        {subject && <ClientSideResult subject={subject} />}
      </RequireAuthentication>
    </Container>
  );
}

/**
 * @todo This function is not yet implemented.
 */
export const getStaticPaths = (async () => {
  return {
    paths: [],
    /**
     * Since we will be using a static export, `fallback: false` is the only suported value.
     * @see https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#unsupported-features
     */
    fallback: false,
  };
}) satisfies GetStaticPaths;

/**
 * @todo This function is not yet implemented.
 */
export const getStaticProps = (async () => {
  return { props: {} };
}) satisfies GetStaticProps;
