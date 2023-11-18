import {Box, Text, ResponsiveValue} from "@chakra-ui/react";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components/index";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import React, {ReactNode, useEffect, useState} from "react";
// import useAuthedFunction from "@src/hooks/useAuthedFunction";
// import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
// import {useAppSelector} from "@src/Store/hooks";

type Size = 'sm' | 'md' | 'lg';

interface AuthenticationRdButtonProps {
  connectText?: string;
  signinText?: string;
  requireSignin?: boolean;
  size?: ResponsiveValue<Size>;
  children: ReactNode;
}

const AuthenticationRdButton: React.FC<AuthenticationRdButtonProps> = ({ connectText, signinText, requireSignin = true, size = 'lg', children }) => {
  // const [manualConnect, setManualConnect] = useState(false);
  // const {isSignedIn, signin, isSigningIn: isAutoSigningIn} = useEnforceSigner();
  // const user = useAppSelector(state => state.user);
  // const [connectWallet] = useAuthedFunction();
  //
  // const handleConnect = async () => {
  //   setManualConnect(true);
  //   connectWallet(() => {});
  // }
  //
  // useEffect(() => {
  //   async function func() {
  //     setManualConnect(false);
  //     await signin();
  //   }
  //   if (manualConnect && !!user.address && !isSignedIn) {
  //     func();
  //   }
  // }, [user.address, isSignedIn]);

  return (
    <AuthenticationGuard>
      {({isConnected, isSignedIn, isConnecting, isSigningIn, signin, connect}) => (
        <>
          {isConnected && (!requireSignin || isSignedIn) ? (
            <>
              {children}
            </>
          ) : isConnected ? (
            <Box textAlign='center' mt={4}>
              {!!signinText && (
                <Text mb={2}>{signinText}</Text>
              )}
              <RdButton
                stickyIcon={true}
                onClick={signin}
                isLoading={isSigningIn}
                size={size}
                // isLoading={isSigningIn || isAutoSigningIn}
              >
                Sign in
              </RdButton>
            </Box>
          ) : (
            <Box textAlign='center' mt={4}>
              {!!connectText && (
                <Text mb={2}>{connectText}</Text>
              )}
              <RdButton
                onClick={connect}
                isLoading={isConnecting}
                size={size}
              >
                Connect Wallet
              </RdButton>
            </Box>
          )}
        </>
      )}
    </AuthenticationGuard>
  )
}

export default AuthenticationRdButton;