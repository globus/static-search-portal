"use client";

import React from "react";

import { Center, Spinner } from "@chakra-ui/react";
import Result from "./Result";

import { useSubject } from "@/hooks/useGlobusAPI";

export const ClientSideResult = ({ subject }: { subject: string }) => {
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
