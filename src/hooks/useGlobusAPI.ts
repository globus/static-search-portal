import { useQuery } from "@tanstack/react-query";
import { transfer, search } from "@globus/sdk";
import { useGlobusAuth } from "@globus/react-auth-context";

import { type AuthorizationManager } from "@globus/sdk/core/authorization/AuthorizationManager";

import { STATIC } from "../../static";

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
    enabled: auth?.isAuthenticated,
    queryKey: ["transfer", "collections", id],
    queryFn: () => fetchCollection(auth.authorization, id),
  });
}

async function fetchSubject(
  authorization: AuthorizationManager | undefined,
  subject: string,
) {
  const response = await search.subject.get(
    STATIC.data.attributes.globus.search.index,
    {
      query: {
        subject,
      },
    },
    { manager: authorization },
  );
  return response.json();
}

export function useSubject(id: string) {
  const auth = useGlobusAuth();
  /**
   * If the user is authenticated, we store that result under a different key.
   */
  const key = ["search"];
  if (auth?.isAuthenticated) {
    key.push("authenticated");
  }
  key.push("subjects", id);
  return useQuery({
    queryKey: key,
    queryFn: () => fetchSubject(auth?.authorization, id),
  });
}
