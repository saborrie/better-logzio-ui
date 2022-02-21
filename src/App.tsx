import React from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { orange } from "@mui/material/colors";

import { QueryClient, QueryClientProvider } from "react-query";
import { LoginProvider } from "./services/auth";
import Main from "./Main";
import { ReactQueryDevtools } from "react-query/devtools";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  status: {
    danger: orange[500],
  },
  typography: {
    fontSize: 12,
  },
  spacing: 2,
});

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginProvider>
          <Main />
        </LoginProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
