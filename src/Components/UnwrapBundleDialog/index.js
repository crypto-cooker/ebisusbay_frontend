import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Spinner
} from "@chakra-ui/react";
import React, {useState} from 'react';
import Button from "@src/Components/components/Button";
import {getTheme} from "@src/global/theme/theme";
import {useDispatch, useSelector} from "react-redux";
import useUnwrapBundle from "../Account/Settings/hooks/useUnwrapBundle";
import {toast} from 'react-toastify';
import {setRefetchNfts,} from "@market/state/redux/slices/user-batch";
import ImageContainer from "../Bundle/ImagesContainer";
import {useUser} from "@src/components-v2/useUser";


const UnwrapBundleDialog = ({ isOpen, onClose, nftBundle }) => {
  const user = useUser();
  const [unwrapBundle, value] = useUnwrapBundle();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const unwrapNftEvent = async () => {
    setIsLoading(true)
    try {
      await unwrapBundle(nftBundle.nftId)
      toast.success('Your bundle was unwrapped successfully');
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    Unwrapping
                    <Spinner size='sm' ms={1} />
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