import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {Center, Spinner} from "@chakra-ui/react";
import React from "react";
import {useUser} from "@src/components-v2/useUser";

const withAuth = (Component) => {
  const Auth = (props) => {
    const router = useRouter();
    const user = useUser();
    const authInitFinished = useSelector((state) => state.appInitialize.authInitFinished);

    if (!authInitFinished) {
      return (
        <Center>
          <Spinner />
        </Center>
      );
    }

    if (!user.wallet.address) {
      router.push('/');
      return <></>;
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withAuth;
