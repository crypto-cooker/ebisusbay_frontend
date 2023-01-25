import React, {useCallback, useEffect} from 'react';
import {specialImageTransform} from "@src/hacks";
import {AnyMedia} from "@src/Components/components/AnyMedia";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";
import {appUrl, isBundle} from "@src/utils";
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

const config = appConfig();

export default function PurchaseSuccessDialog({ onClose, isOpen, listing, tx}) {
  const { onCopy, setValue } = useClipboard();

  const user = useSelector((state) => state.user);
  const userTheme = useSelector((state) => state.user.theme);

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
      setValue(appUrl(`/collection/${listing.nftAddress}/${listing.nftId}`));
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
        <ModalCloseButton color={getTheme(user.theme).colors.textColor4} />
        <ModalBody>
          <VStack>
            <Text textAlign="center">Congratulations! You have successfully purchased {listing.nft.name}</Text>
            <Box w="30%">
              {isBundle(listing.nftAddress) ? (
                <ImagesContainer nft={listing} />
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
            {tx && (
              <Link href={`${config.urls.explorer}tx/${tx.transactionHash}`} isExternal>
                <HStack>
                  <Image src={`/img/logos/cronos_${userTheme === 'dark' ? 'white' : 'blue'}.svg`} width={30} height={30}/>
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
              <ButtonGroup align="center">
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