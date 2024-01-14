import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {RdButton, RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/faq-page";
import {Box, Button, Flex, Image, SimpleGrid, Spinner, Stack, Text} from "@chakra-ui/react";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {appConfig} from "@src/Config";
import {ciEquals} from "@src/utils";
import EmptyData from "@src/Components/Offer/EmptyData";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import ImageService from "@src/core/services/image";
import {UnstakedNfts} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/unstaked-nfts";
import {StakedNfts} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/staked-nfts";
import useTownHallStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-town-hall-stake-nfts";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";

const config = appConfig();

interface StakeNftsProps {
  isOpen: boolean;
  onClose: () => void;
}

const StakeNfts = ({isOpen, onClose}: StakeNftsProps) => {
  const [page, setPage] = useState<string>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const selectedCollection = config.collections.find((collection: any) => ciEquals(collection.address, selectedAddress));

  const { data: winningFaction, status, error } = useQuery({
    queryKey: ['ryoshi-dynasties', 'winning-faction'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getTownHallWinningFaction(),
    enabled: isOpen,
  });


  const handleSelectAddress = (key: string) => (e: any) => {
    setSelectedAddress(key);
  };

  const handleClose = () => {
    onClose();
  }

  const handleBack = () => {
    if (!!page) {
      setPage(undefined);
    } else {
      setPage('faq');
    }
  };

  useEffect(() => {
    if (winningFaction && !selectedAddress) {
      setSelectedAddress(winningFaction.addresses[0])
    }
  }, [winningFaction]);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Stake NFTs'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <>
        {status === 'pending' ? (
          <EmptyData>
            <Spinner size='sm' ms={1} />
          </EmptyData>
        ) : status === "error" ? (
          <p>Error: {error.message}</p>
        ) : (
          <Box p={4}>
            {!!winningFaction ? (
              <>
                <RdModalBox>
                  <Stack direction={{base: 'column-reverse', sm: 'row'}} justify='space-between' align='center'>
                    <Box textAlign={{base: 'center', sm: 'start'}}>
                      <Text>The winning faction of the previous game at the Ebisu's Bay control point is <strong>{winningFaction.name}</strong>!</Text>
                      <Text mt={1}>All NFTs under the collections of this faction can be staked below until the end of the current game.</Text>
                    </Box>
                    <Box w='40px' flexShrink={0} flexGrow={0} flexBasis='40px'>
                      <Image
                        src={ImageService.translate(winningFaction.image).avatar()}
                        rounded='md'
                      />
                    </Box>
                  </Stack>
                </RdModalBox>
                <UnstakePreviousNfts />
                <Flex direction='row' justify='center' my={2}>
                  <SimpleGrid columns={winningFaction.addresses.length}>
                    {winningFaction.addresses.map((address: string) => (
                      <RdTabButton
                        isActive={selectedAddress === address}
                        onClick={handleSelectAddress(address)}
                        whiteSpace='initial'
                        h='auto'
                        minH='40px'
                        py={2}
                      >
                        {config.collections.find((collection: any) => ciEquals(collection.address, address))?.name}
                      </RdTabButton>
                    ))}
                  </SimpleGrid>
                </Flex>
                {!!selectedCollection && (
                  <StakeNftsContent
                    collectionAddress={selectedAddress!}
                  />
                )}
              </>
            ) : (
              <>
                <RdModalBox>
                  <Flex direction='row' justify='center' mb={2}>
                    There is no winning faction yet.
                  </Flex>
                </RdModalBox>
                <UnstakePreviousNfts />
              </>
            )}
          </Box>
        )}
        </>
      )}
    </RdModal>
  )
}

export default StakeNfts;

const UnstakePreviousNfts = () => {
  const {unstakeNfts} = useTownHallStakeNfts();
  const [isExecutingUnstakeAll, setIsExecutingUnstakeAll] = useState(false);

  const handleUnstakeAll = async () => {
    try {
      setIsExecutingUnstakeAll(true);
      await unstakeNfts({invalidOnly: true});
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsExecutingUnstakeAll(false);
    }
  }

  return (
    <RdModalBox mt={2}>
      <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' align='center'  spacing={4}>
        <Box>You have staked NFTs from previous games that are not earning anymore. Click <strong>Unstake All</strong> to return them to your wallet</Box>
        <Box flexShrink={0} flexGrow={0} >
          <Button
            size='sm'
            onClick={handleUnstakeAll}
            isLoading={isExecutingUnstakeAll}
            isDisabled={isExecutingUnstakeAll}
          >
            Unstake All
          </Button>
        </Box>
      </Stack>
    </RdModalBox>
  )
}

interface StakeNftsContentProps {
  collectionAddress: string;
}

const StakeNftsContent = ({collectionAddress}: StakeNftsContentProps) => {
  const [showStaked, setShowStaked] = useState(false);

  return (
    <Box>
      <Flex direction='row' justify='center' mb={2}>
        <SimpleGrid columns={2}>
          <RdTabButton isActive={!showStaked} onClick={() => setShowStaked(false)}>
            Unstaked
          </RdTabButton>
          <RdTabButton isActive={showStaked} onClick={() => setShowStaked(true)}>
            Staked
          </RdTabButton>
        </SimpleGrid>
      </Flex>
      {!showStaked ? (
        <UnstakedNfts
          collectionAddress={collectionAddress}
        />
      ) : (
        <StakedNfts
          collectionAddress={collectionAddress}
        />
      )}
    </Box>
  )
}