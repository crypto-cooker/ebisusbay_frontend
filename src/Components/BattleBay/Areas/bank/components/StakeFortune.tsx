import { useState, useEffect, useCallback} from "react";
import { Modal, ModalContent, ModalFooter, ModalOverlay} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import StakePage from "@src/Components/BattleBay/Areas/bank/components/StakePage.js";
import FaqPage from "@src/Components/BattleBay/Areas/bank/components/FaqPage.js";
import localFont from "next/font/local";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'
import {getProfile} from "@src/core/cms/endpoints/profile";
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPage: string;
}

const StakeFortune = ({ isOpen, onClose, initialPage}: Props) => {
 
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);

  const SetUp = async () => {
    let profile1 = await getProfile(user.address.toLowerCase());
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
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent
        borderWidth='1px'
        borderStyle='solid'
        borderLeftColor='#45433C'
        borderRightColor='#684918'
        borderTopColor='#625C4D'
        borderBottomColor='#181514'
        rounded='3xl'
        bg='linear-gradient(#1C1917, #272624, #000000)'
        className={gothamBook.className}
        >
        {!isLoading ? (
          <> 
            {page === 'faq' ? (
            <FaqPage onBack={() => setPage('main')} onClose={handleClose}/>
            ) : (
            <StakePage address={user.address} profile={profile} onBack={() => setPage('faq')} onClose={handleClose}/>
            )}
          <ModalFooter className="border-0"/>
          </>
        ) : (
          <Spinner animation="border" role="status" size="sm" className="ms-1">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </ModalContent>
    </Modal>
    
  )
}

export default StakeFortune;