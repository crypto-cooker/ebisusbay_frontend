import { useUser } from '@src/components-v2/useUser';
import { Box, HStack, Image, keyframes, Spinner, Text, usePrefersReducedMotion, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import xmasMessages from '@src/components-v2/feature/ryoshi-dynasties/game/areas/village/xmasMessages.json';
import { ApiService } from '@src/core/services/api-service';
import { RdModal } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { RdModalAlert, RdModalBox } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import RdButton from '../../../../components/rd-button';
import { RdModalFooter } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-announcement-modal';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';

interface LootBox {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const ShakeTreeDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const user = useUser();
  const { requestSignature } = useEnforceSignature();
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation1 = prefersReducedMotion ? undefined : `${keyframe_dot1} infinite 1s linear`;
  const animation2 = prefersReducedMotion ? undefined : `${keyframe_dot2} infinite 1s linear`;
  const animation3 = prefersReducedMotion ? undefined : `${keyframe_dot3} infinite 1s linear`;

  const getRandomMessage = (): string => {
    const randomIndex = Math.floor(Math.random() * xmasMessages.length);
    return xmasMessages[randomIndex];
  };

  const [canClaimGift, setCanClaimGift] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [box, setBox] = useState<LootBox>();
  const [boxContents, setBoxContents] = useState<LootBox>();

  const message = useMemo(() => getRandomMessage(), [isOpen]);

  const fetchGift = useCallback(async () => {
    try {
      setIsLoading(true);
      const signature = await requestSignature();
      const res = await ApiService.withoutKey().ryoshiDynasties.checkGift(user.address as string, signature);
      setCanClaimGift(res.data.canClaim);
      setBox(res.data.data?.lootbox);
    } catch (e) {
      console.log(e);
      setCanClaimGift(false);
      setBox(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [user.address]);

  const openGift = async () => {
    if (!box) return;
    try {
      setIsOpening(true);
      await new Promise((r) => setTimeout(r, 5000));

      const signature = await requestSignature();
      const res = await ApiService.withoutKey().ryoshiDynasties.openLootBox(box.id, user.address as string, signature);
      if (res) {
        setOpened(true);
        setBoxContents(res.data.reward.loot);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpening(false);
    }
  };

  const claim = useCallback(async () => {
    try {
      setIsShaking(true);
      const signature = await requestSignature();
      const res = await ApiService.withoutKey().ryoshiDynasties.claimGift(user.address as string, signature);
      if (res.data.lootbox) {
        setBox(res.data.lootbox);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsShaking(false);
    }
  }, [user.address]);

  const handleClose = () => {
    setBox(undefined);
    setOpened(false);
    setBoxContents(undefined);
    onClose();
  };

  useEffect(() => {
    if (user.address && isOpen == true) fetchGift();
  }, [isOpen, user.address]);
  
  return (
    <RdModal isOpen={isOpen} onClose={handleClose} title="Gift from Ebisu Claus">
      <RdModalAlert>
        <Text>{message}</Text>
        {!isLoading ? (
          <>
            <VStack mt={2}>
              {!!box ? (
                <VStack>
                  <Image
                    w={250}
                    src={box.image}
                    alt={''}
                  />
                  {opened ? (
                    <>
                      {boxContents && (
                        <RdModalBox>
                          <VStack align="stretch">
                            <Box fontWeight="bold">You have received</Box>
                            <HStack padding={2} h="full">
                              <Box w={10} h={10} justifyItems={'center'} alignItems={'center'}>
                                {boxContents.image ? (
                                  <Image src={boxContents.image} />
                                ) : (
                                  <Image src="/img/xp_coin.png" />
                                )}
                              </Box>
                              <Box>
                                <Text textAlign="center">{boxContents.name}</Text>
                              </Box>
                            </HStack>
                          </VStack>
                        </RdModalBox>
                      )}
                    </>
                  ) : canClaimGift && (
                    <>
                      <RdButton onClick={openGift} isDisabled={isOpening} isLoading={isOpening} loadingText="Opening">
                        Open Box
                      </RdButton>
                      <Text>Congratulations, You received a lootbox! Open it to see what's inside.</Text>
                    </>
                  )}
                </VStack>
              ) : (
                <>
                  <RdButton
                    w={'200px'}
                    onClick={() => {
                      if (!isShaking) claim();
                    }}
                  >
                    {isShaking ? <Spinner /> : 'Select Gift'}
                  </RdButton>
                </>
              )}
            </VStack>
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
        <Text textAlign={'center'} fontSize={'12'} textColor={'lightgray'}>
          Merry Christmas and Happy Holidays from the team at Ebisu's Bay
        </Text>
      </RdModalFooter>
    </RdModal>
  );
};

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
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9a50b',
    color: '#f9a50b',
    display: ' inline-block',
    margin: '0 2px',
  },
  dot2: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9a50b',
    color: '#f9a50b',
    display: 'inline-block',
    margin: '0 2px',
  },

  dot3: {
    width: '10px',
    height: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9a50b',
    display: 'inline-block',
    margin: '0 2px',
  },
};
