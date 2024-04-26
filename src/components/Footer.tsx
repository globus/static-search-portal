import React from "react";
import {
  Box,
  Center,
  Container,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { defaultsDeep } from "lodash";

import { LinkDefinition, getAttribute } from "../../static";

type Partner = {
  name?: string;
  logo?: string;
  href?: string;
};

export type FooterComponentOptions = {
  partners?: Partner[];
  links?: LinkDefinition[];
  disclaimer?: string;
};

const OPTIONS: FooterComponentOptions = getAttribute("components.Footer", {});

defaultsDeep(OPTIONS, {
  partners: [],
  links: [],
  disclaimer: null,
});

export default function Footer() {
  if (
    OPTIONS.partners?.length === 0 &&
    OPTIONS.links?.length === 0 &&
    !OPTIONS.disclaimer
  ) {
    return null;
  }
  return (
    <footer>
      <Box>
        <Container maxW="container.xl" p={2}>
          {OPTIONS.disclaimer && (
            <Center my={4}>
              <Text fontSize="sm">{OPTIONS.disclaimer}</Text>
            </Center>
          )}
          {OPTIONS.partners && OPTIONS.partners.length > 0 && (
            <HStack wrap="wrap">
              {OPTIONS.partners.map((partner, index) => {
                const Wrapper = partner.href ? Link : Box;
                const props = partner.href
                  ? { href: partner.href, isExternal: true }
                  : {};
                return (
                  <Wrapper key={index} p={2} {...props}>
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        maxH="50px"
                      />
                    ) : (
                      <Text>{partner.name}</Text>
                    )}
                  </Wrapper>
                );
              })}
            </HStack>
          )}
        </Container>
      </Box>
    </footer>
  );
}
