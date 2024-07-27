import React, { createContext, useEffect, useState } from "react";
import { ConfigProvider } from "antd";

import lightTheme from "../themes/light";

import darkTheme from "../themes/dark";

export const ThemeContext = createContext({
  isDark: false,
  setIsDark: (e: any) => {},
  toggleTheme: (e: any) => {},
});
export default function ThemeContextProvider({ children }: any) {
  const [isDark, setIsDark] = useState<boolean>(false);

  const toggleTheme = (e: any) => {
    localStorage.setItem("darkMood", e);
    setIsDark(e);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark,
        toggleTheme,
      }}
    >
      <ConfigProvider theme={isDark ? darkTheme : lightTheme} direction="ltr">
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => React.useContext(ThemeContext);
