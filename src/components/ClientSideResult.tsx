"use client";

import React from "react";

import { Center, Loader } from "@mantine/core";
import Result from "./Result";

import { useSubject } from "@/hooks/useGlobusAPI";

export const ClientSideResult = ({ subject }: { subject: string }) => {
  const { isPending, data } = useSubject(subject);
  if (isPending) {
    return (
      <Center>
        <Loader size="md" />
      </Center>
    );
  }
  return <Result result={data} />;
};
