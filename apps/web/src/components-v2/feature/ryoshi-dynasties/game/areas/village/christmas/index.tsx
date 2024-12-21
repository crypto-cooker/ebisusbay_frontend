import { useUser } from '@src/components-v2/useUser';
import useEnforceSigner from '@src/Components/Account/Settings/hooks/useEnforceSigner';
import { Box, Image, keyframes, Spinner, Text, usePrefersReducedMotion, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import xmasMessages from '@src/components-v2/feature/ryoshi-dynasties/game/areas/village/xmasMessages.json';
import { ApiService } from '@src/core/services/api-service';
import { RdModal } from '@src/components-v2/feature/ryoshi-dynasties/components';
import { RdModalAlert } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-modal';
import RdButton from '../../../../components/rd-button';
import { RdModalFooter } from '@src/components-v2/feature/ryoshi-dynasties/components/rd-announcement-modal';
import useEnforceSignature from '@src/Components/Account/Settings/hooks/useEnforceSigner';

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

  const [hasGift, setHasGift] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shaked, setShaked] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [boxId, setBoxId] = useState<number>(0);

  const fetchGift = async () => {
    try {
      setIsLoading(true);
      const signature = await requestSignature();
      const res = await ApiService.withoutKey().ryoshiDynasties.checkGift(user.address as string, signature);
      setHasGift(res.data.canClaim);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const openGift = useCallback(async () => {
    if (!boxId) return;
    try {
      setIsOpening(true);
      const signature = await requestSignature();
      const res = await ApiService.withoutKey().ryoshiDynasties.openLootBox(boxId, user.address as string, signature);
      if (res) {
        setOpened(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpening(false);
    }
  }, []);

  const claim = useCallback(async () => {
    try {
      setIsShaking(true);
      const signature = await requestSignature();
      const res = await ApiService.withoutKey().ryoshiDynasties.claimGift(user.address as string, signature);
      if (res.open.lootbox) {
        setBoxId(res.lootbox.id);
        setShaked(true);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsShaking(false);
    }
  }, [setShaked]);

  useEffect(() => {
    if (user.address || isOpen) fetchGift();
  }, [isOpen, user.address]);

  return (
    <RdModal isOpen={isOpen} onClose={onClose} title="Gift from Ebisu Claus">
      <RdModalAlert>
        {!isLoading ? (
          <>
            <Text>{getRandomMessage()}</Text>
            {hasGift ? (
              <VStack mt={2}>
                {shaked ? (
                  <>
                    <Image
                      w={40}
                      h={40}
                      src={`${opened ? '/img/lootbox/xmas_gift_no_loop.png' : '/img/lootbox/xmas_gift_no_loop_close.png'}`}
                    ></Image>
                    <Text>Congratulations! You can open your gift in the lootbox.</Text>
                  </>
                ) : (
                  <>
                    <RdButton
                      w={'120px'}
                      onClick={() => {
                        if (!isShaking) claim();
                      }}
                    >
                      {isShaking ? <Spinner /> : 'Shake'}
                    </RdButton>
                    <Text>You can shake the tree to get your present!</Text>
                  </>
                )}
              </VStack>
            ) : (
              <></>
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
