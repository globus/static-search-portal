import { PropsWithChildren } from "react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { Alert, Anchor } from "@mantine/core";
import { useLogin } from "@/hooks/useOAuth";
import { isAuthenticationEnabled } from "@generator";

function CheckAuthentication({ children }: PropsWithChildren) {
  const auth = useGlobusAuth();
  const login = useLogin();
  if (auth?.isAuthenticated) {
    return children;
  }
  return (
    <Alert variant="light" color="red" title="Authentication Required">
      You must{" "}
      <Anchor onClick={login} inherit>
        sign in
      </Anchor>{" "}
      in order to access this section.
    </Alert>
  );
}

export function RequireAuthentication({ children }: PropsWithChildren) {
  if (!isAuthenticationEnabled()) {
    return children;
  }
  return <CheckAuthentication>{children}</CheckAuthentication>;
}
