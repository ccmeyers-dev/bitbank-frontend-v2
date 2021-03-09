import useSwr from "swr";
import axiosInstance from "../services/baseApi";

const fetchWithSearch = (url: string, search: string) =>
  axiosInstance
    .get(url, { params: { search: search || undefined } })
    .then((res) => res.data);

const useSearchRequest = (url: string, searchValue: string, cacheTime: number = 60 * 1000): any => {
  if (!url) {
    console.log("Must use request with a url");
  }

  const { data, mutate, error } = useSwr([url, searchValue], fetchWithSearch, {
    revalidateOnFocus: false,
    dedupingInterval: cacheTime,
    errorRetryCount: 1,
  });

  const update = () => mutate();

  return { data, update, error };
};

export default useSearchRequest;
