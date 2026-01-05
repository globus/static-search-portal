import React, { useRef } from "react";
import {
  Flex,
  Stack,
  Title,
  Group,
  Image,
  UnstyledButton,
} from "@mantine/core";
import Link from "next/link";

import { getAttribute } from "../../static";
import Navigation from "./Navigation";
import { ColorSchemeToggle } from "./ColorSchemeToggle";

const SEARCH_INDEX = getAttribute("globus.search.index");
const LOGO = getAttribute("content.logo");
const HEADLINE = getAttribute(
  "content.headline",
  `Search Index ${SEARCH_INDEX}`,
);

const IMAGE = getAttribute("content.image", null);

export default function Header() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Stack gap={0} bg="primary.9" ref={ref}>
      <Flex
        component="header"
        mih={{ base: "50px", md: "100px", lg: "120px" }}
        align="center"
        justify="space-between"
        style={{
          backgroundImage: IMAGE ? `url(${IMAGE})` : undefined,
          backgroundSize: IMAGE ? "cover" : undefined,
          backgroundPosition: IMAGE ? "center" : undefined,
        }}
        px="xs"
      >
        <UnstyledButton component={Link} href="/" aria-label="Home">
          <Group gap="sm" align="center">
            {LOGO && <Image src={LOGO.src} alt={LOGO.alt} w="100px" />}
            <Title
              c={IMAGE ? "white" : "black"}
              order={1}
              size="xl"
              bdrs={IMAGE ? 4 : 0}
              py={IMAGE ? 2 : undefined}
              px={IMAGE ? 4 : undefined}
              bg={IMAGE ? "rgba(0,0,0,0.50)" : undefined}
            >
              {HEADLINE}
            </Title>
          </Group>
        </UnstyledButton>

        <Group>
          <Navigation />
          <ColorSchemeToggle />
        </Group>
      </Flex>
    </Stack>
  );
}
