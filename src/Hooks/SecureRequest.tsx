import useSwr from "swr";
import axiosInstance from "../services/baseApi";

const fetcher = (url: string) => axiosInstance(url).then((res) => res.data);

const useSecureRequest = (url: string, cacheTime: number = 60 * 1000): any => {
  if (!url) {
    console.log("Must use request with a url");
  }

  const { data, mutate, error } = useSwr(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: cacheTime,
    errorRetryCount: 1,
  });

  const update = () => mutate();

  return { data, update, error };
};

export default useSecureRequest;
