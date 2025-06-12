import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider and createTheme

// Create a default theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Example primary color
    },
    background: {
      paper: "#ffffff", // Example background color for paper
    },
  },
});

export const Context = createContext({
  isAuthorized: false,
});

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({});

  return (
    <Context.Provider
      value={{
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
      }}
    >
      <ThemeProvider theme={theme}> {/* Wrap App with ThemeProvider */}
        <App />
      </ThemeProvider>
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);