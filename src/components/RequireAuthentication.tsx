import React, { PropsWithChildren } from "react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { isFeatureEnabled } from "../../static";
import { Alert, AlertIcon, AlertTitle, Button } from "@chakra-ui/react";
import { useLogin } from "@/hooks/useOAuth";

const requireAuthentication = isFeatureEnabled("requireAuthentication");

export function RequireAuthentication({ children }: PropsWithChildren) {
  const auth = useGlobusAuth();
  const login = useLogin();
  if (!requireAuthentication) {
    return children;
  }
  return auth.isAuthenticated ? (
    children
  ) : (
    <Alert status="error" my={4}>
      <AlertIcon />
      <AlertTitle>
        You must{" "}
        <Button variant="link" onClick={login}>
          Sign In
        </Button>{" "}
        in order to access this section.
      </AlertTitle>
    </Alert>
  );
}
