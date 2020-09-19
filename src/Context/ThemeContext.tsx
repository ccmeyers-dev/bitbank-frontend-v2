import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext<any>({});

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<string>("");

  const localTheme = localStorage.getItem("theme");

  const changeTheme = (theme: string) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
    return;
  };

  useEffect(() => {
    // console.log("setting theme ", theme);

    if (localTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme, localTheme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
