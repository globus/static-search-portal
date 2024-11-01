import React from "react";
import { useRouter } from "next/router";

import { Container, Text, Link, Flex, Divider } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import { ClientSideResult } from "@/components/ClientSideResult";
import { RequireAuthentication } from "@/components/RequireAuthentication";

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
