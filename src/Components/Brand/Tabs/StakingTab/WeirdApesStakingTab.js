import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {useDispatch, useSelector} from "react-redux";
import {Center, Radio, RadioGroup, SimpleGrid, Stack, Text, VStack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {ERC721} from "@src/Contracts/Abis";
import {Spinner} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import StakingNftCard from "@src/Components/Brand/Tabs/StakingTab/StakingNftCard";
import Link from "next/link";
import Button from "@src/Components/components/Button";
import MetaMaskOnboarding from "@metamask/onboarding";
import {chainConnect, connectAccount} from "@src/GlobalState/User";

const config = appConfig();
const readProvider = new ethers.providers.JsonRpcProvider(config.rpc.read);
const stakingContractAddress = '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44';
const stakingAbi = [
  'function stake(uint256 _tokenId)',
  'function unstake(uint256 _tokenId)'
]
const gwacAddress = '0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44';
const filterTypes = {
  all: 'all',
  staked: 'staked',
  unstaked: 'unstaked'
};
const queryKey = 'WeirdApesStakingTab';

const WeirdApesStakingTab = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [filterType, setFilterType] = useState(filterTypes.all);
  const [filteredData, setFilteredData] = useState([]);
  const stakeMutation = useStakeMutation();
  const unstakeMutation = useUnstakeMutation();

  const {
    data,
    error,
    hasNextPage,
    status,
  } = useQuery(
    [queryKey, user.address],
    () => getApes(user.address),
    {
      refetchOnWindowFocus: false,
      enabled: !!user.address
    }
  );

  const handleStake = async (nftId) => {
    await stakeMutation.mutateAsync(nftId);
  };

  const handleUnstake = async (nftId) => {
    await unstakeMutation.mutateAsync(nftId);
  };

  const handleConnect = () => {
    if (!user.address) {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  useEffect(() => {
    setFilteredData(data?.filter((nft) => {
      if (filterType === filterTypes.staked) return nft.isStaked;
      if (filterType === filterTypes.unstaked) return !nft.isStaked;
      return nft;
    }) ?? []);
  }, [data, filterType]);

  return (
    <>
      {user.address ? (
        <>
          {status === "loading" ? (
            <div className="col-lg-12 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : status === "error" ? (
            <p>Error: {error.message}</p>
          ) : (
            <>
              <RadioGroup onChange={setFilterType} value={filterType} mb={2}>
                <Stack direction='row'>
                  <Radio value={filterTypes.all}>All</Radio>
                  <Radio value={filterTypes.unstaked}>Unstaked</Radio>
                  <Radio value={filterTypes.staked}>Staked</Radio>
                </Stack>
              </RadioGroup>
              <InfiniteScroll
                dataLength={data?.pages ? data.pages.flat().length : 0}
                next={false}
                hasMore={hasNextPage}
                style={{ overflow: 'hidden' }}
                loader={
                  <div className="row">
                    <div className="col-lg-12 text-center">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  </div>
                }
              >
                {filteredData.length > 0 ? (
                  <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6}} gap={4}>
                    {filteredData.map((nft) => (
                      <StakingNftCard
                        key={nft.nftId}
                        nft={nft}
                        isStaked={nft.isStaked}
                        onStake={handleStake}
                        onUnstake={handleUnstake}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Center>
                    {filterType === filterTypes.staked ? (
                      <>No staked Apes found</>
                    ) : filterType === filterType.unstaked ? (
                      <>No unstaked Apes found</>
                    ) : (
                      <>No Apes found.</>
                    )}

                  </Center>
                )}
                <Center mt={4}>
                  Need some more apes? Pick some up in the&nbsp;
                  <Link href="/collection/0x0b289dEa4DCb07b8932436C2BA78bA09Fbd34C44"><a className="color fw-bold">Marketplace</a></Link>
                </Center>
              </InfiniteScroll>
            </>
          )}
        </>
      ) : (
        <VStack>
          <Text>Connect wallet to view Apes</Text>
          <Button type="legacy"
                  onClick={handleConnect}
                  className="flex-fill"
          >
            Connect
          </Button>
        </VStack>
      )}
    </>
  )
}

export default WeirdApesStakingTab;

const useStakeMutation = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);

  return useMutation({
    mutationFn: async (nftId) => {
      const stakingContract = new Contract(stakingContractAddress, stakingAbi, user.provider.getSigner());
      const tx = await stakingContract.stake(nftId);
      await tx.wait();
      return nftId;
    },
    onSuccess: data => {
      queryClient.setQueryData([queryKey, user.address], old => {
        const index = old.findIndex((nft) => nft.nftId === data);
        old[index].isStaked = true;
        return old;
      })
    }
  })
}

const useUnstakeMutation = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);

  return useMutation({
    mutationFn: async (nftId) => {
      const stakingContract = new Contract(stakingContractAddress, stakingAbi, user.provider.getSigner());
      const tx = await stakingContract.unstake(nftId);
      await tx.wait();
      return nftId;
    },
    onSuccess: data => {
      queryClient.setQueryData([queryKey, user.address], old => {
        const index = old.findIndex((nft) => nft.nftId === data);
        old[index].isStaked = false;
        return old;
      })
    }
  })
}

const getApes = async (address) => {
  const quickWallet = await getQuickWallet(address, {collection: gwacAddress, pageSize: 1000});
  if (!quickWallet.data) return [];

  const readContract = new Contract(gwacAddress, ERC721, readProvider);
  return Promise.all(quickWallet.data.map(async (nft) =>{
    const isStaked = await readContract.stakedApes(nft.nftId);
    return {...nft, isStaked}
  }));
}