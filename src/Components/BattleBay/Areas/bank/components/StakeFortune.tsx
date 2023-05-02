import { useState, useEffect, useCallback} from "react";
import { Modal, ModalContent, ModalFooter, ModalOverlay} from "@chakra-ui/react"
import { Spinner } from 'react-bootstrap';
import StakePage from "@src/Components/BattleBay/Areas/bank/components/StakePage.js";
import FaqPage from "@src/Components/BattleBay/Areas/bank/components/FaqPage.js";
import localFont from "next/font/local";

const gothamBook = localFont({ src: '../../../../../fonts/Gotham-Book.woff2' })

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPage: string;
}

const StakeFortune = ({ isOpen, onClose, initialPage}: Props) => {
 
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    setPage(initialPage);
    onClose();
  }, []);

  useEffect(() => {
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
            <StakePage onBack={() => setPage('faq')} onClose={handleClose}/>
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