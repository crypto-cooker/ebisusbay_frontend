import {Modal, ModalBody, ModalContent, ModalOverlay} from "@chakra-ui/react";
import React, {useCallback, useEffect, useState} from "react";
import FortuneReservationPage from "@src/components-v2/feature/ryoshi-dynasties/token-sale/dialog/reservation";
import FortuneFaqPage from "@src/components-v2/feature/ryoshi-dynasties/token-sale/dialog/faq";
import localFont from "next/font/local";

const gothamBook = localFont({ src: '../../../../../global/assets/fonts/Gotham-Book.woff2' })


interface PurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage: string;
}

const FortunePurchaseDialog = ({isOpen, onClose, initialPage}: PurchaseDialogProps) => {
  const [page, setPage] = useState(initialPage);

  const handleClose = useCallback(() => {
    setPage(initialPage);
    onClose();
  }, []);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  return (
    <>
      <Modal
        onClose={() => {}}
        isOpen={isOpen}
        size='2xl'
        scrollBehavior='inside'
        isCentered
      >
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
          <ModalBody p={2}>
            {page === 'faq' ? (
              <FortuneFaqPage onBack={() => setPage('main')} onClose={handleClose} />
            ) : (
              <FortuneReservationPage onFaq={() => setPage('faq')} onClose={handleClose} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}


export default FortunePurchaseDialog;