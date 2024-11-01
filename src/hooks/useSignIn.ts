import { useOAuthStore } from "@/store/oauth";
import { useGlobusAuth } from "@globus/react-auth-context";

export function useSignIn() {
  const auth = useGlobusAuth();
  const oauthStore = useOAuthStore();
  return async () => {
    oauthStore.setReplaceWith(
      window.location.pathname + window.location.search,
    );
    await auth.authorization?.login();
  };
}
