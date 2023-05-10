import React, {useCallback, useEffect, useState} from "react";
import {Spinner} from 'react-bootstrap';
import localFont from "next/font/local";
import {getProfile} from "@src/core/cms/endpoints/profile";
import RdModal from "@src/components-v2/feature/ryoshi-dynasties/components/modal";
import {ArrowBackIcon} from "@chakra-ui/icons";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/faq-page";
import StakePage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/stake-page";

const gothamBook = localFont({ src: '../../../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  address: string;
  isOpen: boolean;
  onClose: () => void;
  initialPage: string;
}

const Index = ({address, isOpen, onClose, initialPage}: Props) => {
 
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  // const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);

  const SetUp = async () => {
    let profile1 = await getProfile(address);
    setProfile(profile1);
  }

  const handleClose = useCallback(() => {
    setPage(initialPage);
    onClose();
  }, []);

  useEffect(() => {
    SetUp();
    setPage(initialPage);
  }, [initialPage]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Stake Fortune'
      utilBtnTitle={page === 'faq' ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={() => setPage(page === 'faq' ? 'main' : 'faq')}
    >
      {!isLoading ? (
        <>
          {page === 'faq' ? (
            <FaqPage />
          ) : (
            <StakePage />
          )}
        </>
      ) : (
        <Spinner animation="border" role="status" size="sm" className="ms-1">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </RdModal>
  )
}

export default Index;