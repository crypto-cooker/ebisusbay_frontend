import {useQuery} from "@tanstack/react-query";
import {useUser} from "@src/components-v2/useUser";
import {Box, Center, SimpleGrid, Spinner, Stack, Text} from "@chakra-ui/react";
import React, {useState} from "react";
import StakingNftCard
  from "@src/components-v2/feature/ryoshi-dynasties/game/areas/town-hall/stake-nft/staking-nft-card";
import {TownHallStakeNftContext} from "./context";
import {ApiService} from "@src/core/services/api-service";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import {RdButton} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {pluralize} from "@market/helpers/utils";
import {toast} from "react-toastify";
import useTownHallStakeNfts from "@src/components-v2/feature/ryoshi-dynasties/game/hooks/use-town-hall-stake-nfts";

interface StakedNftsProps {
  collectionAddress: string;
}

export const StakedNfts = ({collectionAddress}: StakedNftsProps) => {
  const user = useUser();
  const {signature} = useEnforceSignature();
  const {unstakeNfts} = useTownHallStakeNfts();

  const [selectedNfts, setSelectedNfts] = React.useState<any[]>([]);
  const [isExecutingUnstake, setIsExecutingUnstake] = useState(false);
  const [isExecutingUnstakeAll, setIsExecutingUnstakeAll] = useState(false);

  const { data, status, error } = useQuery({
    queryKey: ['TownHallUserStakedNfts', user.address, collectionAddress],
    queryFn: () => ApiService.withoutKey().ryoshiDynasties.getTownHallUserStaked(user.address!, collectionAddress, signature),
    refetchOnWindowFocus: false,
    enabled: !!collectionAddress && !!user.address && !!signature
  });

  const onAdd = (nft: any) => {
    if (!selectedNfts.find((selectedNft) => selectedNft.nftAddress === nft.nftAddress && selectedNft.nftId === nft.nftId)) {
      setSelectedNfts([...selectedNfts, nft]);
    }
  }

  const onRemove = (nftAddress: string, nftId: string) => {
    if (selectedNfts.find((selectedNft) => selectedNft.nftAddress === nftAddress && selectedNft.nftId === nftId)) {
      setSelectedNfts(selectedNfts.filter((selectedNft) => selectedNft.nftAddress !== nftAddress && selectedNft.nftId !== nftId));
    }
  }

  const validate = () => {
    const hasData = data && data.length > 0;
    if (!hasData) {
      toast.error('There are no available NFTs to unstake');
      return false;
    }

    return true;
  }

  const handleUnstake = () => {
    if (!validate()) return;
    if (selectedNfts.length < 1) {
      toast.error('Please select at least one NFT to unstake');
      return;
    }

    unstake(false);
  }

  const handleUnstakeAll = () => {
    if (!validate()) return;

    unstake(true);
  }

  const unstake = async (isAll: boolean) => {
    if (!user.address) return;

    try {
      if (isAll) setIsExecutingUnstakeAll(true);
      else setIsExecutingUnstake(true);

      const nfts = selectedNfts.map((nft) => ({
        nftAddress: nft.nftAddress,
        nftId: nft.nftId,
        amount: 1,
      }));
      await unstakeNfts({
        nfts,
        collectionAddress,
        isAll
      });

      toast.success('Untaking successful!');
    } catch (e) {
      console.error(e);
      toast.error('Unstaking failed');
    } finally {
      setIsExecutingUnstakeAll(false);
      setIsExecutingUnstake(false);
    }
  }

  return (
    <TownHallStakeNftContext.Provider value={{selectedNfts}}>
      <Box position='relative'>
        {data && data.length > 0 && (
          <RdModalBox
            position="sticky"
            top={-2}
            zIndex="sticky"
          >
            <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' align='center' spacing={4} minH='56px'>
              <Box my='auto'>There {pluralize(selectedNfts.length, 'is', 'are')} <strong>{selectedNfts.length}</strong> {pluralize(selectedNfts.length, 'item')} selected</Box>
              <Stack direction='row' flexShrink={0} flexGrow={0}>
                {selectedNfts.length > 0 && !isExecutingUnstakeAll && (
                  <RdButton
                    size='sm'
                    stickyIcon={isExecutingUnstake}
                    onClick={handleUnstake}
                    isLoading={isExecutingUnstake}
                    isDisabled={isExecutingUnstake}
                  >
                    Unstake
                  </RdButton>
                )}
                {data && data.length > 1 && !isExecutingUnstake && (
                  <RdButton
                    size='sm'
                    stickyIcon={isExecutingUnstakeAll}
                    onClick={handleUnstakeAll}
                    isLoading={isExecutingUnstakeAll}
                    isDisabled={isExecutingUnstakeAll}
                  >
                    Unstake All
                  </RdButton>
                )}
              </Stack>
            </Stack>
          </RdModalBox>
        )}
        <Box mt={2}>
          {status === 'pending' ? (
            <Center>
              <Spinner />
            </Center>
          ) : status === "error" ? (
            <p>Error: {(error as any).message}</p>
          ) : data && data.length > 0 ? (
            <SimpleGrid
              columns={{base: 2, sm: 3, md: 4}}
              gap={3}
            >
              {data.map((nft: any) => (
                <StakingNftCard
                  key={nft.name}
                  nft={nft}
                  onAdd={() => onAdd(nft)}
                  onRemove={() => onRemove(nft.nftAddress, nft.nftId)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign='center' mt={8}>
              <Text>No NFTs found</Text>
            </Box>
          )}
        </Box>
      </Box>
    </TownHallStakeNftContext.Provider>
  )
}