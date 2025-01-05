import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { GlobalStyles } from "./styles/GlobalStyles";
import { Router } from "../src/Router/Router";
import { ThemeProvider } from "../src/context/ThemePorvider";
import { AuthProvider } from "../src/context/AuthProvider";
import { DiaryProvider } from "./context/DiaryPorovider";
import Loading from "./components/Loading/Loading";

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <DiaryProvider>
          <GlobalStyles />
          {isLoading ? <Loading /> : <RouterProvider router={Router} />}
        </DiaryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
