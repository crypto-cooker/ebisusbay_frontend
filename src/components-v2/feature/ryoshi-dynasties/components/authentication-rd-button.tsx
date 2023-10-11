import {Box, Text} from "@chakra-ui/react";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components/index";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import React, {ReactNode, useEffect, useState} from "react";
// import useAuthedFunction from "@src/hooks/useAuthedFunction";
// import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
// import {useAppSelector} from "@src/Store/hooks";

interface AuthenticationRdButtonProps {
  connectText?: string;
  signinText?: string;
  children: ReactNode;
}

const AuthenticationRdButton: React.FC<AuthenticationRdButtonProps> = ({ connectText, signinText, children }) => {
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
          {isConnected && isSignedIn ? (
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