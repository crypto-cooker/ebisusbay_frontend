import React, {useCallback} from 'react';
import {toast} from "react-toastify";
import {appUrl} from "@src/utils";
import {getTheme} from "@src/Theme/theme";
import {
  ButtonGroup,
  Center,
  Flex,
  HStack,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useClipboard,
  VStack
} from "@chakra-ui/react";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faTelegram, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {CheckCircleIcon} from "@chakra-ui/icons";
import {appConfig} from "@src/Config";
import {ContractReceipt} from "ethers";
import {useAppSelector} from "@src/Store/hooks";
import CronosIcon from "@src/components-v2/shared/icons/cronos";
import {retrieveProfile} from "@src/GlobalState/User";
import {useDispatch} from "react-redux";
import {useUser} from "@src/components-v2/useUser";

const config = appConfig();

type GdcClaimSuccessDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  tx?: ContractReceipt
};

export default function GdcClaimSuccess({ onClose, isOpen, tx}: GdcClaimSuccessDialogProps) {
  const dispatch = useDispatch();
  const { onCopy, setValue } = useClipboard(appUrl(`/account}`).toString());

  const user = useUser();

  const handleCopy = useCallback(() => {
    onCopy();
    toast.success('Link copied!');
  }, [onCopy]);

  const shareOptions = [
    {
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      label: 'Share on Facebook',
      icon: faFacebook
    },
    {
      url: 'https://twitter.com/intent/tweet?text=',
      label: 'Share on Twitter',
      icon: faTwitter
    },
    {
      url: 'https://telegram.me/share/?url=',
      label: 'Share on Telegram',
      icon: faTelegram
    },
    {
      label: 'Share on Telegram',
      icon: faLink,
      handleClick: handleCopy
    }
  ];

  const handleClose = () => {
    dispatch(retrieveProfile());
    onClose();
  };

  return (
    <Modal onClose={handleClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <HStack>
              <CheckCircleIcon color="green" bg="white" rounded="full" border="1px solid white"/>
              <Text>NFT Has Been Claimed!</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
        <ModalBody>
          <VStack>
            <Text textAlign="center">Congratulations! You have successfully claimed the GDC Proof-Of-Attendance NFT</Text>
            {tx && (
              <Link href={`${config.urls.explorer}tx/${tx.transactionHash}`} isExternal>
                <HStack>
                  <CronosIcon boxSize={6}/>
                  <Text>View on Cronoscan</Text>
                </HStack>
              </Link>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter alignContent="center">
          <VStack w="full">
            <Text>Share</Text>
            <Flex justify="center">
              <ButtonGroup>
                {shareOptions.map((shareOption) => (
                  <IconButton
                    icon={<FontAwesomeIcon icon={shareOption.icon} />}
                    aria-label={shareOption.label}
                    onClick={() => shareOption.handleClick ? shareOption.handleClick() : window.open(`${shareOption.url}${window.location}`, '_blank')}
                  />
                ))}
              </ButtonGroup>
            </Flex>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}