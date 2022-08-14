import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { appConfig } from "@src/Config";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Spinner } from "react-bootstrap";
import axios from 'axios';

import { getAuthSignerInStorage } from '@src/helpers/storage';
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

const VerificationEmail = () => {
  const router = useRouter();
  const { verificationToken } = router.query;
  const [isLoading, getSigner] = useCreateSigner();
  const config = appConfig();
  const user = useSelector((state) => state.user);


  const emailVerification = async () => {

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    const address = user.address;

    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }

    if (signatureInStorage) {
      try {
        const fetchResponse = await axios.post(`${config.urls.cms}profile/email-verification?signature=${signatureInStorage}&address=${address}&token=${verificationToken}`)
        toast.success('Your email was verified');
        router.push(`/account/settings/profile`);
      }
      catch (error) {
        toast.error('Something went wrong!');
        router.push(`/account/settings/profile`);
      }
    }
  }

  useEffect(() => {
    if (verificationToken && user?.address) {
      emailVerification();
    }
  }, [verificationToken, user?.address])

  return (
    <>
      <div className="row">
        <div className="col-lg-12 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    </>
  )

}

export default VerificationEmail;