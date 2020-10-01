import useSwr from "swr";
import axios from "axios";

const fetcher = (url: string) => axios(url).then((res) => res.data);

const usePlainRequest = (
  url: string,
  cacheTime: number = 60 * 60 * 1000
): any => {
  if (!url) {
    console.log("Must use request with a url");
  }

  const { data, error } = useSwr(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: cacheTime,
    shouldRetryOnError: false,
  });

  return { data, error };
};

export default usePlainRequest;
