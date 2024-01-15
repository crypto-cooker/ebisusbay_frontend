import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/faq-page";
import {Box, Button, Flex, Image, SimpleGrid, Spinner, Stack, Text} from "@chakra-ui/react";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {appConfig} from "@src/Config";
import {ciEquals} from "@src/utils";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import ImageService from "@src/core/services/image";
import {UnstakedNfts} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/unstaked-nfts";
import {StakedNfts} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/staked-nfts";
import useTownHallStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-town-hall-stake-nfts";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import {useUser} from "@src/components-v2/useUser";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import AuthenticationRdButton from "@src/components-v2/feature/ryoshi-dynasties/components/authentication-rd-button";

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
      const collections = Object.keys(winningFaction.factionCollectionsSnapshot);
      if (collections && collections.length > 0) {
        setSelectedAddress(collections[0]);
      }
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
        {status === "pending"  ? (
          <Box textAlign='center' py={4}>
            <Spinner />
          </Box>
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
                    <Box w='50px' flexShrink={0} flexGrow={0} flexBasis='50px'>
                      <Image
                        src={ImageService.translate(winningFaction.image).avatar()}
                        rounded='md'
                      />
                    </Box>
                  </Stack>
                </RdModalBox>
                <UnstakePreviousNfts />
                <Flex direction='row' justify='center' my={2}>
                  <SimpleGrid columns={Object.keys(winningFaction.factionCollectionsSnapshot).length}>
                    {Object.entries(winningFaction.factionCollectionsSnapshot).map(([address, collection]: [string, any]) => (
                      <RdTabButton
                        isActive={selectedAddress === address}
                        onClick={handleSelectAddress(address)}
                        whiteSpace='initial'
                        h='auto'
                        minH='40px'
                        py={2}
                      >
                        {collection.name}
                      </RdTabButton>
                    ))}
                  </SimpleGrid>
                </Flex>
                <AuthenticationRdButton
                  connectText='Connect and sign-in to manage your staked NFTs'
                  signinText='Connect and sign-in to manage your staked NFTs'
                >
                  {!!selectedCollection && (
                    <StakeNftsContent
                      collectionAddress={selectedAddress!}
                    />
                  )}
                </AuthenticationRdButton>
              </>
            ) : (
              <>
                <RdModalBox>
                  <Box textAlign='center'>
                    <Text>The winning faction of the previous game at the Ebisu's Bay control point will have their collections available here for staking.</Text>
                    <Text mt={4}>There is no winning faction yet.</Text>
                  </Box>
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
  const user = useUser();
  const {signature} = useEnforceSignature();
  const {unstakeNfts} = useTownHallStakeNfts();
  const [isExecutingUnstakeAll, setIsExecutingUnstakeAll] = useState(false);

  const {data} = useQuery({
    queryKey: ['RyoshiDynastiesStakedInvalidNfts'],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getTownHallUserInvalidStaked(user.address!, signature),
    enabled: !!user.address && !!signature,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 6
  });

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

  return !!data && data.length > 0 && (
    <RdModalBox mt={2}>
      <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' align='center'  spacing={4}>
        <Box>You have staked NFTs from previous games that are not earning anymore. Click <strong>Unstake All</strong> to return them to your wallet</Box>
        <Box flexShrink={0} flexGrow={0}>
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