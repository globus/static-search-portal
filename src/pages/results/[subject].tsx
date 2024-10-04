import React from "react";
import { useRouter } from "next/router";

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

import Result from "../../components/Result";

import { useSubject } from "@/hooks/useGlobusAPI";

const ClientSideResult = ({ subject }: { subject: string }) => {
  const { isPending, data } = useSubject(subject);
  if (isPending) {
    return (
      <Center>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }
  return <Result result={data} />;
};

export default function ResultPage() {
  const router = useRouter();
  const subject = Array.isArray(router.query.subject)
    ? router.query.subject[0]
    : router.query.subject;
  return (
    <Container maxW="container.xl" p={4}>
      <Link onClick={() => router.back()}>
        <Flex alignItems="center" mb={4}>
          <ChevronLeftIcon /> <Text fontSize="sm">Back</Text>
        </Flex>
      </Link>
      <Divider my={2} />
      {subject && <ClientSideResult subject={subject} />}
    </Container>
  );
}
