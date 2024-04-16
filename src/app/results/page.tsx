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

import { STATIC } from "../../../static";

import Result from "../../components/Result";
import { search } from "@globus/sdk";

import { GMetaResult } from "../page";

export default function ResultPage() {
  const router = useRouter();
  const params = useSearchParams();
  const subject = params.get("subject");

  const [result, setResult] = useState<GMetaResult>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      const response = await (
        await search.subject.get(STATIC.data.attributes.globus.search.index, {
          query: {
            subject: Array.isArray(subject) ? subject[0] : subject,
          },
        })
      ).json();
      setIsLoading(false);
      setResult(response);
    }

    fetchResult();
  }, [subject]);

  return (
    <Container maxW="container.xl" p={4}>
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
        <Link onClick={() => router.back()}>
          <Flex alignItems="center" mb={4}>
            <ChevronLeftIcon /> <Text fontSize="sm">Back</Text>
          </Flex>
        </Link>
        <Divider my={2} />
        <Result result={result} isLoading={isLoading} />
      </Suspense>
    </Container>
  );
}
