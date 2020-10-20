import { useEffect } from "react";

export const useScript = (src: string, id: string) => {
  useEffect(() => {
    const existingScript = document.getElementById(id);

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.id = id;
      document.body.appendChild(script);

      script.onload = () => {
        localStorage.setItem(id, "true");
      };
      script.onerror = () => {
        localStorage.setItem(id, "false");
      };
    }
  }, [src, id]);
};
