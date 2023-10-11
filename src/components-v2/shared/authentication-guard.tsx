import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {useAppSelector} from "@src/Store/hooks";
import {ReactNode} from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";

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
  const dispatch = useDispatch();
  const {isSignedIn, signin, isSigningIn} = useEnforceSigner();
  const user = useAppSelector(state => state.user);

  const handleConnect = async () => {
    if (user.needsOnboard) {
      const onboarding = new MetaMaskOnboarding();
      onboarding.startOnboarding();
    } else if (!user.address) {
      dispatch(connectAccount());
    } else if (!user.correctChain) {
      dispatch(chainConnect());
    }
  };

  return <>
    {children({
      isConnected: !!user.address,
      isSignedIn: isSignedIn,
      isConnecting: user.connectingWallet,
      isSigningIn: isSigningIn,
      signin,
      connect: handleConnect,
      error: null,
    })}
  </>;
}

export default AuthenticationGuard;