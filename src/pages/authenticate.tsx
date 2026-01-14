import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Center, Loader, Text, Group } from "@mantine/core";
import { isFeatureEnabled } from "../../static-lib";
import { useOAuthStore } from "@/store/oauth";

function Authenticate() {
  const auth = useGlobusAuth();
  const oauthStore = useOAuthStore();
  const router = useRouter();
  const instance = auth.authorization;

  /**
   * Attempt to handle the incoming OAuth2 redirect.
   */
  useEffect(() => {
    async function attempt() {
      if (!instance) {
        return;
      }
      /**
       * Attempt to handle incoming OAuth2 redirect.
       */
      await instance.handleCodeRedirect({
        /**
         * We'll handle the redirect ourselves...
         */
        shouldReplace: false,
      });
    }
    attempt();
  }, [instance]);

  /**
   * Once the user is authenticated, refresh the tokens and redirect to the transfer page.
   */
  useEffect(() => {
    async function redirect() {
      if (!instance || !auth.isAuthenticated) {
        return;
      }
      await instance.refreshTokens();
      const replaceWith = oauthStore.replaceWith;
      router.replace(replaceWith);
      return () => {
        oauthStore.reset();
      };
    }
    redirect();
  }, [router, instance, auth.isAuthenticated, oauthStore]);

  return (
    <>
      <Center my="lg">
        <Group gap="xs">
          <Loader size="sm" />
          <Text>Attempting to validate credentials...</Text>
        </Group>
      </Center>
    </>
  );
}

export default isFeatureEnabled("authentication") ? Authenticate : () => null;
