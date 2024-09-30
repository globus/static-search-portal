"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { isFeatureEnabled } from "../../../static";

function Authenticate() {
  const auth = useGlobusAuth();
  const router = useRouter();
  const instance = auth.authorization;

  useEffect(() => {
    async function attempt() {
      if (auth.isAuthenticated) {
        return router.replace("/");
      } else {
        await instance?.handleCodeRedirect({
          shouldReplace: false,
        });
      }
    }
    attempt();
  }, [router, instance, instance?.handleCodeRedirect, auth.isAuthenticated]);
  return (
    <>
      <Center mt={4}>
        <Spinner mr="2" />
        <Text>Attempting to validate credentials...</Text>
      </Center>
    </>
  );
}

export default isFeatureEnabled("authentication") ? Authenticate : () => null;
