import { useUserInfo } from "./useUserInfo";

export default function usePermission() {
  const {perms, isAdmin} = useUserInfo();
  return {
    test: (perm?: string) => {
      if (!perm || isAdmin) {
        return true;
      }
      return perms.includes(perm);
    },
  };
}
