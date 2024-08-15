import {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { appConfig } from "@src/config";
import axios from 'axios';
import {Center, Spinner} from "@chakra-ui/react";

const VerificationEmail = () => {
  const router = useRouter();
  const { verificationToken } = router.query;
  const config = appConfig();
  const [success, setSuccess] = useState<boolean | null>(null);

  const emailVerification = async () => {
    try {
      const fetchResponse = await axios.post(`${config.urls.cms}profile/email-verification?&token=${verificationToken}`);
      setSuccess(true);
    }
    catch (error) {
      setSuccess(false);
    }
  }

  useEffect(() => {
    async function verify() {
      await emailVerification();
    }

    if (verificationToken) {
      verify();
    } else if (router.isReady) {
      router.push(`/`);
    }
  }, [verificationToken, router.isReady])

  return success !== null ? (
    <div className="row mt-4">
      <div className="text-center">
        {success ? (
          <>Verification success! You can now close this window</>
        ) : (
          <>Verification failed. Please try again</>
        )}
      </div>
    </div>
  ) : (
    <Center>
      <Spinner />
    </Center>
  );
}

export default VerificationEmail;