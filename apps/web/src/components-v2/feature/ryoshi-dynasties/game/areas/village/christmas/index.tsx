import {useUser} from "@src/components-v2/useUser";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {Box, Image, keyframes, Text, usePrefersReducedMotion, VStack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import xmasMessages from "@src/components-v2/feature/ryoshi-dynasties/game/areas/village/xmasMessages.json";
import {ApiService} from "@src/core/services/api-service";
import * as Sentry from "@sentry/nextjs";
import {Contract} from "ethers";
import Resources from "@src/global/contracts/Resources.json";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@market/helpers/utils";
import {parseErrorMessage} from "@src/helpers/validator";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {RdModalAlert} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import ImageService from "@src/core/services/image";
import RdButton from "../../../../components/rd-button";
import {RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-announcement-modal";
import {appConfig} from "@src/config";

const config = appConfig();

export const ShakeTreeDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const user = useUser();
  const {requestSignature, isSignedIn, signin, isSigningIn} = useEnforceSigner();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [openShakePresent,setOpenShakePresent ] = useState(false);
  const [presentMessage, setPresentMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isClaimingToken, setIsClaimingToken] = useState<number>();

  const animation1 = prefersReducedMotion ? undefined : `${keyframe_dot1} infinite 1s linear`;
  const animation2 = prefersReducedMotion ? undefined : `${keyframe_dot2} infinite 1s linear`;
  const animation3 = prefersReducedMotion ? undefined : `${keyframe_dot3} infinite 1s linear`;

  const getRandomEntry = (entries: string[]): string => {
    const randomIndex = Math.floor(Math.random() * entries.length);
    return entries[randomIndex];
  };

  const presentPresent = async () => {

    setShowMessage(false);
    await new Promise(r => setTimeout(r, 2000));
    setShowMessage(true);

    setPresentMessage(getRandomEntry(xmasMessages));
    setOpenShakePresent(false);
  }

  const [gift, setGift] = useState<any>();
  const fetchGift = async () => {
    if (!user.address) {
      presentPresent();
      return;
    }

    try {
      setShowMessage(false);
      const signature = await requestSignature();
      const gift = await ApiService.withoutKey().ryoshiDynasties.fetchGift(user.address, signature);
      let d = gift.data;
      if (gift.data.nfts.length > 0) {
        const items = await ApiService.withoutKey().getCollectionItems({
          address: config.contracts.resources,
          token: gift.data.nfts.join(',')
        });
        d.nftData = items.data;
      }
      setGift(d);
    } catch (e) {
      Sentry.captureException(e);
      console.log(e);
      presentPresent();
    } finally {
      setShowMessage(true);
    }
  }

  const handleClaimNft = async (tokenId: number) => {
    if (!user.address) return;

    try {
      setIsClaimingToken(tokenId);
      const signature = await requestSignature();
      const authorization = await ApiService.withoutKey().ryoshiDynasties.requestResourcesWithdrawalAuthorization(tokenId, 1, user.address, signature);
      const {signature: approvalSignature, approval} = authorization.data;

      const resourcesContract = new Contract(config.contracts.resources, Resources, user.provider.getSigner());
      const tx = await resourcesContract.mintWithSig(approval, approvalSignature);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    } catch (e) {
      Sentry.captureException(e);
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsClaimingToken(undefined);
    }
  }


  useEffect(() => {
    if (!isOpen) return;

    if (user.address) {
      fetchGift();
    } else {
      presentPresent();
    }
  }, [isOpen, user.address]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Gifts from Ebisu Claus'
    >
      <RdModalAlert>
        {showMessage ? (
          <>
            {user.wallet.isConnected ? (
              <Box>
                <VStack>
                  {((gift?.nfts && gift?.nfts?.length > 0) || (!!gift?.frtn && gift.frtn > 0)) && (
                    <Box fontWeight='bold'>Merry Christmas, you have received gifts!</Box>
                  )}
                  {!!gift?.frtn && gift.frtn > 0 && (
                    <VStack>
                      <FortuneIcon boxSize={10}/>
                      <Box>{gift.frtn} $FRTN. Can be claimed in the bank</Box>
                    </VStack>
                  )}
                  {gift?.nftData && gift?.nftData?.length > 0 ? (
                    <>
                      {gift.nftData.map((nft: any) => (
                        <VStack>
                          <Image
                            src={ImageService.translate(nft.image).custom({width: 150, height: 150})}
                            alt={nft.name}
                            rounded="md"
                          />
                          <Box>{nft.description}</Box>
                          <RdButton
                            stickyIcon={true}
                            onClick={() => handleClaimNft(parseInt(nft.id))}
                            isLoading={isClaimingToken === parseInt(nft.id)}
                            isDisabled={!!isClaimingToken}
                            size='md'
                          >
                            Claim
                          </RdButton>
                        </VStack>
                      ))}
                    </>
                  ) : (gift?.nfts && gift?.nfts?.length > 0) ? (
                    <Box>A gift has been received but no info was provided yet. Check back later!</Box>
                  ) : (
                    <Box>No gifts received yet. Check back later!</Box>
                  )}
                </VStack>
              </Box>
            ) : (
              <>
                <Text>{presentMessage}</Text>
                <Text fontSize='sm' mt={4}>Connect your wallet for a surprise!</Text>
              </>
            )}
          </>
        ) : (
          <Box>
            <Box style={styles2.dot1} animation={animation1} />
            <Box style={styles2.dot2} animation={animation2} />
            <Box style={styles2.dot3} animation={animation3} />
          </Box>
        )}
      </RdModalAlert>
      <RdModalFooter>
        <Text textAlign={'center'} fontSize={'12'} textColor={'lightgray'}>Merry Christmas and Happy Holidays from the team at Ebisu's Bay</Text>
      </RdModalFooter>
    </RdModal>
  )
}


const keyframe_dot1 = keyframes`
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1.5);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
`;
const keyframe_dot2 = keyframes`
 0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1.5);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
`;
const keyframe_dot3 = keyframes`
 0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
`;


const styles2 = {
  dot1: {
    width: "10px",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#f9a50b",
    color: "#f9a50b",
    display: " inline-block",
    margin: "0 2px"
  },
  dot2: {
    width: "10px",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#f9a50b",
    color: "#f9a50b",
    display: "inline-block",
    margin: "0 2px"
  },

  dot3: {
    width: "10px",
    height: "10px",
    borderRadius: "5px",
    backgroundColor: "#f9a50b",
    display: "inline-block",
    margin: "0 2px"
  }
};