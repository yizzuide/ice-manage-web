import useUserStore from "../store/userStore";

export const useUserInfo = function () {
  const userStore = useUserStore();
  return userStore.userInfo;
};
