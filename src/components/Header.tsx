import React from "react";
import { HStack, Heading, Box, Image, Container, Flex } from "@chakra-ui/react";
import Link from "next/link";

import { getAttribute } from "../../static";
import Navigation from "./Navigation";

const SEARCH_INDEX = getAttribute("globus.search.index");
const LOGO = getAttribute("content.logo");
const HEADLINE = getAttribute(
  "content.headline",
  `Search Index ${SEARCH_INDEX}`,
);

const IMAGE = getAttribute("content.image", null);

export default function Header() {
  return (
    <Flex
      as="header"
      bg="primary.800"
      minH={{ base: "50px", md: "10vh" }}
      align="center"
      justify="center"
      bgImage={IMAGE ? `url(${IMAGE})` : undefined}
      bgSize={IMAGE ? "cover" : undefined}
      bgPosition={IMAGE ? "center" : undefined}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          minWidth="max-content"
          alignItems={{ base: "flex-start", md: "center" }}
          justify={{ base: "space-around", md: "space-between" }}
          my={2}
        >
          <Box>
            <Link href="/">
              <HStack py={4} spacing="24px">
                {LOGO && (
                  <Image
                    src={LOGO.src}
                    alt={LOGO.alt}
                    boxSize="100px"
                    objectFit="contain"
                  />
                )}
                <Heading as="h1" size="md" color="white">
                  {HEADLINE}
                </Heading>
              </HStack>
            </Link>
          </Box>
          <Navigation />
        </Flex>
      </Container>
    </Flex>
  );
}
