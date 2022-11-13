import { useUserInfo } from "./useUserInfo";

export default function usePermission() {
  const perms = useUserInfo().perms;
  return {
    test: (perm?: string) => {
      if (!perm) {
        return true;
      }
      return perms.includes(perm);
    },
  };
}
