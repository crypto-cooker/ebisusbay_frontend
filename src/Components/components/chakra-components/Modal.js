import {
  Modal as ModalCK,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { getTheme } from "@src/Theme/theme";
import { useSelector } from "react-redux";

export default function Modal( { title, body, dialogActions, isOpen, onClose } ) {
  const user = useSelector((state) => state.user);

  return (
    <ModalCK isCentered onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
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
    </ModalCK>
  );
}