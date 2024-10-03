import { useQuery } from "@tanstack/react-query";
import { transfer } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { type AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

export async function fetchCollection(
  authorization: AuthorizationManager | undefined,
  id: string,
) {
  const response = await transfer.endpoint.get(
    id,
    {},
    { manager: authorization },
  );
  return response.json();
}

export function useCollection(id: string) {
  const auth = useGlobusAuth();
  return useQuery({
    enabled: auth.isAuthenticated,
    queryKey: ["collections", id],
    queryFn: () => fetchCollection(auth.authorization, id),
  });
}
