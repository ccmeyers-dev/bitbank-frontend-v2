import useSecureRequest from "./SecureRequest";

export const useProfile = () => {
  const { data, update, error }: any = useSecureRequest("/users/profile/");
  return { data, update, error };
};
