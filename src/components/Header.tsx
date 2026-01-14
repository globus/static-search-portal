import { useRef } from "react";
import {
  Flex,
  Stack,
  Title,
  Group,
  Image,
  UnstyledButton,
  Box,
} from "@mantine/core";
import Link from "next/link";
import dynamic from "next/dynamic";

import { getStatic } from "../../static-lib";
import { ColorSchemeToggle } from "./ColorSchemeToggle";

const Navigation = dynamic(() => import("./Navigation"), { ssr: false });

export default function Header() {
  const SEARCH_INDEX = getStatic().data.attributes.globus.search.index;
  const LOGO = getStatic().data.attributes.content?.logo;
  const HEADLINE =
    getStatic().data.attributes.content?.headline ||
    `Search Index ${SEARCH_INDEX}`;
  const IMAGE = getStatic().data.attributes.content?.image || null;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Stack gap={0} ref={ref}>
      <Flex
        component="header"
        mih={{ base: "50px", md: IMAGE ? "100px" : undefined }}
        align="center"
        justify="space-between"
        style={{
          backgroundImage: IMAGE ? `url(${IMAGE})` : undefined,
          backgroundSize: IMAGE ? "cover" : undefined,
          backgroundPosition: IMAGE ? "center" : undefined,
        }}
        p="xs"
      >
        <UnstyledButton component={Link} href="/" aria-label="Home">
          <Group gap="sm" align="center">
            {LOGO && (
              <Box bg="primary.9" bdrs="xs" py="sm" px="md">
                <Image src={LOGO.src} alt={LOGO.alt} w="100px" />
              </Box>
            )}
            <Title
              c={IMAGE ? "white" : undefined}
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
