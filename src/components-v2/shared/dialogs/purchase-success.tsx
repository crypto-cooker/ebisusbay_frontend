import React, {useCallback, useEffect} from 'react';
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/components-v2/shared/media/any-media";
import {toast} from "react-toastify";
import {appUrl, isBundle, isLandDeedsCollection} from "@src/utils";
import {getTheme} from "@src/Theme/theme";
import {
  Box,
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
import Image from "next/image";
import ImagesContainer from "@src/Components/Bundle/ImagesContainer";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faTelegram, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {CheckCircleIcon} from "@chakra-ui/icons";
import {appConfig} from "@src/Config";
import {ContractReceipt} from "ethers";
import {useAppSelector} from "@src/Store/hooks";
import CronosIcon from "@src/components-v2/shared/icons/cronos";
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";

const config = appConfig();

type PurchaseSuccessDialogProps = {
  onClose: () => void;
  isOpen: boolean;
  listing: any;
  tx?: ContractReceipt
};

export default function PurchaseSuccessDialog({ onClose, isOpen, listing, tx}: PurchaseSuccessDialogProps) {
  const { onCopy, setValue } = useClipboard(appUrl(`/collection/${listing.nftAddress}/${listing.nftId}`).toString());

  const user = useAppSelector((state) => state.user);
  const userTheme = useAppSelector((state) => state.user.theme);

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

  useEffect(() => {
    if (listing) {
      setValue(appUrl(`/collection/${listing.nftAddress}/${listing.nftId}`).toString());
    }
  }, [listing]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>
            <HStack>
              <CheckCircleIcon color="green" bg="white" rounded="full" border="1px solid white"/>
              <Text>Purchase Complete!</Text>
            </HStack>
          </Center>
        </ModalHeader>
        <ModalCloseButton color={getTheme(user.theme)!.colors.textColor4} />
        <ModalBody>
          <VStack>
            <Box w="30%">
              {isBundle(listing.nftAddress) ? (
                <ImagesContainer nft={listing.nft} />
              ) : isLandDeedsCollection(listing.nft.nftAddress) ? (
                <RdLand nftId={listing.nft.nftId} />
              ) : (
                <AnyMedia
                  image={specialImageTransform(listing.nft.nftAddress, listing.nft.image)}
                  video={listing.nft.video ?? listing.nft.animation_url}
                  videoProps={{ height: 'auto', autoPlay: true }}
                  title={listing.nft.name}
                  usePlaceholder={false}
                  className="img-fluid img-rounded"
                />
              )}
            </Box>
            <Text textAlign="center">Congratulations! You have successfully purchased {listing.nft.name}</Text>
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