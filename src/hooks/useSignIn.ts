import { useOAuthStore } from "@/store/oauth";
import { useGlobusAuth } from "@globus/react-auth-context";
import { usePathname, useSearchParams } from "next/navigation";

export function useSignIn() {
  const auth = useGlobusAuth();
  const oauthStore = useOAuthStore();
  const pathname = usePathname();
  const search = useSearchParams();
  return async () => {
    oauthStore.setReplaceWith(`${pathname}${search ? `?${search}` : ""}`);
    await auth.authorization?.login();
  };
}
