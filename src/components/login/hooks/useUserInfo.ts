import useUserStore from "../store/userStore";

const userStore = useUserStore();

export const useUserInfo = function () {
  return userStore.userInfo;
};
