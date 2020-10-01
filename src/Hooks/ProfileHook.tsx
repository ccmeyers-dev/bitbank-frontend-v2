import useSecureRequest from "./SecureRequest";

export const useProfile = () => {
  const { data, update }: any = useSecureRequest("/users/profile/");
  return { data, update };
};
