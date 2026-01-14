import { PropsWithChildren } from "react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Alert, Anchor } from "@mantine/core";
import { useLogin } from "@/hooks/useOAuth";
import { isFeatureEnabled } from "@from-static/generator-kit";

export function RequireAuthentication({ children }: PropsWithChildren) {
  const requireAuthentication = isFeatureEnabled("requireAuthentication");
  const auth = useGlobusAuth();
  const login = useLogin();
  if (!requireAuthentication) {
    return children;
  }
  return auth.isAuthenticated ? (
    children
  ) : (
    <Alert variant="light" color="red">
      You must <Anchor onClick={login}>sign in</Anchor> in order to access this
      section.
    </Alert>
  );
}
