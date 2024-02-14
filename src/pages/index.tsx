import { useEffect, useState, FormEvent } from "react";
import NextLink from "next/link";

import { search, authorization } from "@globus/sdk";
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

import { contents } from "../../static.json";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

type SearchResponse = {
  total: number;
  gmeta: {
    subject: string;
    entries: {
      content: {
        title: string;
        summary: string;
      };
    }[];
  }[];
};

export default function Index() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState<null | SearchResponse>(null);

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
      const response = await search.query.get(contents.globus.search.index, {
        query: {
          q: query,
        },
      });
      const results = await response.json();
      setResults(results);
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Box bg="brand.800">
        <HStack p={4} spacing="24px">
          <Image
            src={contents.logo.src}
            alt={contents.logo.alt}
            boxSize="100px"
            objectFit="contain"
          />
          <Heading size="md" color="white">
            {contents.headline}
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
                  const entry = gmeta.entries[0];
                  return (
                    <LinkBox
                      as={NextLink}
                      href={`/results/${gmeta.subject}`}
                      key={i}
                    >
                      <Card size="sm" w="full">
                        <CardHeader>
                          <Heading size="md" color="brand">
                            {entry.content.title}
                          </Heading>
                        </CardHeader>
                        <CardBody>
                          <Text noOfLines={[3, 5, 10]}>
                            {entry.content.summary}
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
