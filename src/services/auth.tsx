import React from "react";

const TokenContext = React.createContext<null | {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}>(null);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState(() => localStorage.getItem("token"));

  return <TokenContext.Provider value={{ token, setToken }}>{children}</TokenContext.Provider>;
}

export function useSignIn() {
  const { setToken } = React.useContext(TokenContext)!;

  return React.useCallback((token) => {
    localStorage.setItem("token", token);
    setToken(token);
  }, []);
}

export function useToken(): string | null {
  const { token } = React.useContext(TokenContext)!;
  return token;
}

export function useLoggedIn() {
  const token = useToken();
  return Boolean(token);
}
