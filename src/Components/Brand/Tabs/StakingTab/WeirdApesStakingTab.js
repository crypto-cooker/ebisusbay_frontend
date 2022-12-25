import {Contract, ethers} from "ethers";
import {appConfig} from "@src/Config";
import {useSelector} from "react-redux";
import {Center, Radio, RadioGroup, SimpleGrid, Stack} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {getQuickWallet} from "@src/core/api/endpoints/wallets";
import {ERC721} from "@src/Contracts/Abis";
import {Spinner} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import StakingNftCard from "@src/Components/Brand/Tabs/StakingTab/StakingNftCard";
import Link from "next/link";

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

const WeirdApesStakingTab = () => {
  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState(filterTypes.all);

  const {
    data,
    error,
    hasNextPage,
    status,
  } = useQuery(
    ['WeirdApesStakingTab-User', user.address],
    () => getApes(user.address),
    {
      refetchOnWindowFocus: false,
      enabled: !!user.address
    }
  );

  const onStake = async (nftId) => {
    const stakingContract = new Contract(stakingContractAddress, stakingAbi, user.provider.getSigner());
    const tx = await stakingContract.stake(nftId);
    await tx.wait();
    await queryClient.invalidateQueries({ queryKey: ['WeirdApesStakingTab-User', user.address] })
  };

  const onUnstake = async (nftId) => {
    const stakingContract = new Contract(stakingContractAddress, stakingAbi, user.provider.getSigner());
    const tx = await stakingContract.unstake(nftId);
    await tx.wait();
    await queryClient.invalidateQueries({ queryKey: ['WeirdApesStakingTab-User', user.address] })
  };

  const [filteredData, setFilteredData] = useState([]);
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
                  <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} gap={4}>
                    {filteredData.map((nft) => (
                      <StakingNftCard
                        key={nft.nftId}
                        nft={nft}
                        isStaked={nft.isStaked}
                        onStake={onStake}
                        onUnstake={onUnstake}
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
        <>Must sign in</>
      )}
    </>
  )
}

export default WeirdApesStakingTab;

const getApes = async (address) => {
  const quickWallet = await getQuickWallet(address, {collection: gwacAddress, pageSize: 1000});
  if (!quickWallet.data) return [];

  const readContract = new Contract(gwacAddress, ERC721, readProvider);
  return Promise.all(quickWallet.data.map(async (nft) =>{
    const isStaked = await readContract.stakedApes(nft.nftId);
    return {...nft, isStaked}
  }));
}