import React from "react";
import produce from "immer";

export interface Account {
  name: string;
  token: string;
}

interface AuthState {
  accounts: Account[];
  selectedAccount?: Account;
}

const AuthStateContext = React.createContext<null | {
  token: string | null;
  selectedAccount?: Account;
  accounts: string[];
  addAccount: (account: Account) => void;
  changeAccount: (name: string) => void;
}>(null);

function updateLocalStorage(value: AuthState): AuthState {
  const stringValue = JSON.stringify(value);
  localStorage.setItem("authState", stringValue);
  return value;
}

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = React.useState<AuthState>(() =>
    JSON.parse(localStorage.getItem("authState") ?? '{ "accounts": [] }')
  );

  const token = authState.selectedAccount?.token ?? null;

  return (
    <AuthStateContext.Provider
      value={{
        token,
        selectedAccount: authState.selectedAccount,
        accounts: authState.accounts.map((a) => a.name),
        addAccount: (account) =>
          setAuthState((s) =>
            updateLocalStorage(
              produce(s, (x) => {
                x.selectedAccount = account;
                x.accounts.push(account);
              })
            )
          ),
        changeAccount: (name) =>
          setAuthState((s) =>
            updateLocalStorage(
              produce(s, (x) => {
                x.selectedAccount = x.accounts.find((a) => a.name === name);
              })
            )
          ),
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
}

export function useSignIn() {
  const { addAccount } = React.useContext(AuthStateContext)!;

  return React.useCallback((account: Account) => {
    addAccount(account);
  }, []);
}

export function useChangeAccount() {
  const { changeAccount } = React.useContext(AuthStateContext)!;

  return React.useCallback((name: string) => {
    changeAccount(name);
  }, []);
}

export function useAccounts() {
  const { accounts } = React.useContext(AuthStateContext)!;
  return accounts;
}

export function useSelectedAccount() {
  const { selectedAccount } = React.useContext(AuthStateContext)!;
  return selectedAccount;
}

export function useToken(): string | null {
  const { token } = React.useContext(AuthStateContext)!;
  return token;
}

export function useLoggedIn() {
  const token = useToken();
  return Boolean(token);
}
