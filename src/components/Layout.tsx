import React, { PropsWithChildren } from "react";
import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";

import Header from "@/components/Header";
import GlobusLogo from "../../public/_default/globus.svg";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Flex direction="column" flex="1">
      <Header />
      <Flex as="main" role="main" direction="column" flex="1" mb="50px">
        <Container maxW="5xl">{children}</Container>
      </Flex>
      <Box
        as="footer"
        position={{ base: "relative", md: "fixed" }}
        bottom="0"
        left="0"
        right="0"
      >
        <Container maxW="container.xl" pb={2}>
          <Flex justify="space-between">
            <Link href="https://www.globus.org/" isExternal>
              <HStack>
                <Text fontSize="sm">Powered by Globus</Text>{" "}
                <Icon
                  as={Image}
                  src={GlobusLogo}
                  viewBox="0 0 256 256"
                  width="100px"
                  boxSize={6}
                  color="gray.500"
                  alt=""
                />
              </HStack>
            </Link>
          </Flex>
        </Container>
      </Box>
    </Flex>
  );
}
