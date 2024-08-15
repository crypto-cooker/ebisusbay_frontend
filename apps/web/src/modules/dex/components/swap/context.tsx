import {createContext, ReactNode, useContext} from "react";

interface TokenBoxContextType {
  tokenKey: 'tokenA' | 'tokenB';
}

export const TokenBoxContext = createContext<TokenBoxContextType | undefined>(undefined);

// Provider component that fetches and provides the token balances
export const TokenBoxProvider = ({ tokenKey, children }: TokenBoxContextType & { children: ReactNode }) => {
  return <TokenBoxContext.Provider value={{ tokenKey }}>{children}</TokenBoxContext.Provider>;
};

export const useTokenBoxContext = () => {
  const context = useContext(TokenBoxContext);
  if (!context) {
    throw new Error('useTokenBoxContext must be used within a TokenBoxProvider');
  }
  return context;
};
