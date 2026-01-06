import React, { PropsWithChildren } from "react";
import { Text, Group, Container, Affix, Image } from "@mantine/core";
import { AnchorExternal } from "./private/AnchorExternal";
import NextImage from "next/image";

import Header from "@/components/Header";
import GlobusLogo from "../../public/_default/globus.svg";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <Container component="main" role="main" my="xs">
        {children}
      </Container>
      <Affix position={{ bottom: 0, left: 10, right: 0 }}>
        <AnchorExternal href="https://www.globus.org/">
          <Group gap="xs" align="center">
            <Text fz="sm">Powered by Globus</Text>
            <Image
              component={NextImage}
              src={GlobusLogo}
              h={24}
              w="auto"
              alt=""
            />
          </Group>
        </AnchorExternal>
      </Affix>
    </>
  );
}
