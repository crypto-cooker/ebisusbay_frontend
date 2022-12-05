import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Flex,
  HStack,
  Box
} from "@chakra-ui/react";
import React, {useState} from 'react';
import Button from "@src/Components/components/Button";
import { getTheme } from "@src/Theme/theme";
import { Card, Form, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import useUnwrapBundle from "../Account/Settings/hooks/useUnwrapBundle";
import { toast } from 'react-toastify';
import {
  setRefetchNfts,
} from "@src/GlobalState/batchListingSlice";
import ImageContainer from "../Bundle/ImagesContainer";



const UnwrapBundleDialog = ({ isOpen, onClose, nftBundle }) => {

  const user = useSelector((state) => state.user);
  const [unwrapBundle, value] = useUnwrapBundle();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const unwrapNftEvent = async () => {
    setIsLoading(true)
    try {
      await unwrapBundle(nftBundle.id)
      toast.success('Your bundle was unwrap successfully');
      onClose();
      dispatch(setRefetchNfts(true))
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong!');
    }
    setIsLoading(false)

  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="text-center">
          Unwrap "{nftBundle.name}"
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        <>
          <ModalBody>
            <Center>
              <Center maxWidth='300px'>
                {<ImageContainer nft={nftBundle} />}
              </Center>
            </Center>

          </ModalBody>
          <ModalFooter className="border-0">
            <div className="w-100">
              <Button type="legacy"
                className="w-100"
                onClick={unwrapNftEvent}
              >
                {isLoading ? (
                  <>
                    Unwrapping
                    <Spinner animation="border" role="status" size="sm" className="ms-1">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </>
                ) : (
                  <>Unwrap</>
                )}
              </Button>
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  )

}

export default UnwrapBundleDialog;