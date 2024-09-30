"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Container,
  Text,
  Link,
  Flex,
  Divider,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import { STATIC, withFeature } from "../../../static";

import Result from "../../components/Result";
import { search } from "@globus/sdk";

import { GMetaResult } from "@globus/sdk/services/search/service/query";
import { useGlobusAuth } from "@globus/react-auth-context";

const ClientSideResult = () => {
  const params = useSearchParams();
  const auth = useGlobusAuth();
  const subject = params.get("subject");
  const [result, setResult] = useState<GMetaResult>();
  useEffect(() => {
    async function fetchResult() {
      const headers = withFeature("authentication", () => {
        if (!auth.isAuthenticated || !auth.authorization?.tokens.search) {
          return;
        }
        return {
          Authorization: `Bearer ${auth.authorization.tokens.search.access_token}`,
        };
      });

      const response = await (
        await search.subject.get(STATIC.data.attributes.globus.search.index, {
          query: {
            subject: Array.isArray(subject) ? subject[0] : subject,
          },
          headers: headers ?? undefined,
        })
      ).json();
      setResult(response);
    }
    fetchResult();
  }, [subject]);
  return <Result result={result} />;
};

export default function ResultPage() {
  const router = useRouter();
  return (
    <Container maxW="container.xl" p={4}>
      <Link onClick={() => router.back()}>
        <Flex alignItems="center" mb={4}>
          <ChevronLeftIcon /> <Text fontSize="sm">Back</Text>
        </Flex>
      </Link>
      <Divider my={2} />
      <Suspense
        fallback={
          <Center>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        }
      >
        <ClientSideResult />
      </Suspense>
    </Container>
  );
}
