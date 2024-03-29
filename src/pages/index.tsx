import React, { useEffect, useState, FormEvent } from "react";
import NextLink from "next/link";

import { search } from "@globus/sdk";
import {
  Input,
  Container,
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  Heading,
  VStack,
  HStack,
  Image,
  LinkBox,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import { STATIC, getStaticField } from "../../static";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export type SearchEntry = {
  entry_id: string | null;
  matched_principal_sets: string[];
  content: {
    [key: string]: unknown;
  };
};

export type GMetaResult = {
  "@datatype": "GMetaResult";
  "@version": string;
  subject: string;
  entries: SearchEntry[];
};

type GSearchResult = {
  "@datatype": "GSearchResult";
  "@version": string;
  offset: number;
  total: number;
  has_next_page: boolean;
  gmeta: GMetaResult[];
};

export type GError = {
  "@datatype": "GError";
  message: string;
  code: string;
  request_id: string;
  status: number;
  error: Record<string, unknown> | Array<GError>;
};

export default function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<null | GSearchResult>(null);

  const updateQueryParam = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set(key, value);
    router.replace(`?${currentParams.toString()}`);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults(null);
        return;
      }
      const response = await search.query.get(
        STATIC.data.attributes.globus.search.index,
        {
          query: {
            q: query,
          },
        },
      );
      const results = await response.json();
      setResults(results);
    };

    fetchResults();
  }, [query]);

  const { logo, headline } = STATIC.data.attributes.content;

  return (
    <>
      <Box bg="brand.800">
        <HStack p={4} spacing="24px">
          {logo && (
            <Image
              src={logo.src}
              alt={logo.alt}
              boxSize="100px"
              objectFit="contain"
            />
          )}
          <Heading size="md" color="white">
            {headline}
          </Heading>
        </HStack>
      </Box>
      <Container maxW="container.xl">
        <main>
          <Box p={4}>
            <Input
              type="search"
              placeholder="Start your search here..."
              value={query || ""}
              onInput={(e: FormEvent<HTMLInputElement>) => {
                updateQueryParam("q", e.currentTarget.value);
              }}
            />
          </Box>

          <Box>
            {results && (
              <Stat size="sm">
                <StatLabel>Results</StatLabel>
                <StatNumber>{results.total} datasets found</StatNumber>
              </Stat>
            )}
            <VStack py={2} spacing={5} align="stretch">
              {results &&
                results.gmeta.map((gmeta, i) => {
                  return (
                    <LinkBox
                      as={NextLink}
                      href={`/results/${encodeURIComponent(gmeta.subject)}`}
                      key={i}
                    >
                      <Card size="sm" w="full">
                        <CardHeader>
                          <Heading size="md" color="brand">
                            {getStaticField(gmeta, "result.title")}
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <Text noOfLines={[3, 5, 10]}>
                            {getStaticField(gmeta, "result.summary")}
                          </Text>
                        </CardBody>
                      </Card>
                    </LinkBox>
                  );
                })}
            </VStack>
          </Box>
        </main>
      </Container>
    </>
  );
}
