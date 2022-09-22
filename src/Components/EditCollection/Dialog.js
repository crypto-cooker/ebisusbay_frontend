import * as React from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import {getTheme} from "@src/Theme/theme";
import {useSelector} from "react-redux";

export default function CustomizedDialogs({propsDialog}) {
  const user = useSelector((state) => state.user);
  const {title, body, dialogActions, isOpen, setIsOpen} = propsDialog;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal onClose={handleClose} isOpen={isOpen} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center" onClose={handleClose}>
            {title}
          </ModalHeader>
          <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
          <ModalBody>
            {body}
          </ModalBody>
          <ModalFooter className="border-0">
            {dialogActions}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}