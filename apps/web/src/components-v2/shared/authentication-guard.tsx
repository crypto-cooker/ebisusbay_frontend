import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {ReactNode} from "react";
import {useUser} from "@src/components-v2/useUser";
import { useAppKit } from '@reown/appkit/react';

type AuthRenderProps = (props: {
  isConnected: boolean;
  isSignedIn: boolean;
  isConnecting: boolean;
  isSigningIn: boolean;
  signin: () => void;
  connect: () => void;
  error: string | null;
}) => ReactNode;

interface AuthenticationGuardProps {
  children: AuthRenderProps;
}

const AuthenticationGuard = ({ children }: AuthenticationGuardProps) => {
  const {isSignedIn, signin, isSigningIn} = useEnforceSigner();
  const user = useUser();
  const { open } = useAppKit();

  return <>
    {children({
      isConnected: user.wallet.isConnected,
      isSignedIn: isSignedIn,
      isConnecting: user.initializing,
      isSigningIn: isSigningIn,
      signin,
      connect: () => open(),
      error: null,
    })}
  </>;
}

export default AuthenticationGuard;