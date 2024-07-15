import {ArrowBackIcon} from "@chakra-ui/icons";
import React, {useEffect, useState} from "react";
import RdModal, {RdModalBox, RdModalFooter} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import FaqPage from "@src/components-v2/feature/ryoshi-dynasties/game/areas/tavern/mint-heroes/faq-page";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  useNumberInput,
  VStack
} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import NextApiService from "@src/core/services/api-service/next";
import {appConfig} from "@src/config";
import RdTabButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-tab-button";
import {ciEquals, createSuccessfulTransactionToastContent} from "@market/helpers/utils";
import WalletNft from "@src/core/models/wallet-nft";
import {Contract} from "ethers";
import {parseUnits} from "ethers/lib/utils";
import {ERC1155} from "@src/global/contracts/Abis";
import {toast} from "react-toastify";
import {parseErrorMessage} from "@src/helpers/validator";
import RdButton from "@src/components-v2/feature/ryoshi-dynasties/components/rd-button";
import {DynamicNftImage} from "@src/components-v2/shared/media/dynamic-nft-image";
import {useUser} from "@src/components-v2/useUser";
import * as Sentry from "@sentry/nextjs";

const config = appConfig();
const guardsAddress = config.collections.find((c: any) => c.slug === 'fortune-guards').address;
const heroesAddress = config.collections.find((c: any) => c.slug === 'ryoshi-heroes').address;
let abi = require(`@market/assets/abis/ryoshi-tales-heroes.json`);
const tabs = {
  mint: 'mint',
  heroes: 'heroes'
};

interface MintHeroesProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintHeroes = ({isOpen, onClose}: MintHeroesProps) => {
  const [page, setPage] = useState<string>();
  const [currentTab, setCurrentTab] = useState(tabs.mint);

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

  const handleTabChange = (key: string) => (e: any) => {
    setCurrentTab(key);
  };

  return (
    <RdModal
      isOpen={isOpen}
      onClose={handleClose}
      title='Mint Heroes'
      size='5xl'
      isCentered={false}
      utilBtnTitle={!!page ? <ArrowBackIcon /> : <>?</>}
      onUtilBtnClick={handleBack}
    >
      {page === 'faq' ? (
        <FaqPage />
      ) : (
        <Box p={4}>
          <Text align='center'>Obtain your own unique Hero Gen.0 and discover its rarity level, class, and stats.
            Let your Hero guide your army into victory and achieve legendary quests!</Text>
          <Box p={4}>
            <Flex direction='row' justify='center' mb={2}>
              <SimpleGrid columns={2}>
                <RdTabButton isActive={currentTab === tabs.mint} onClick={handleTabChange(tabs.mint)}>
                  Mint
                </RdTabButton>
                <RdTabButton isActive={currentTab === tabs.heroes} onClick={handleTabChange(tabs.heroes)}>
                  My Heroes
                </RdTabButton>
              </SimpleGrid>
            </Flex>
            <Box>
              <Text></Text>
              {currentTab === tabs.mint ? (
                <Mint />
              ) : currentTab === tabs.heroes && (
                <Heroes />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </RdModal>
  )
}


export default MintHeroes;

const Mint = () => {
  const user = useUser();

  const {data: guardsList, error: error1} = useQuery({
    queryKey: ['Guards'],
    queryFn: () => NextApiService.getCollectionItems(guardsAddress, {
      pageSize: 4,
      address: guardsAddress
    })
  });

  const {data: userGuards, refetch, isLoading, error: error2} = useQuery({
    queryKey: ['AvailableGuards', user.address],
    queryFn: () => NextApiService.getWallet(user.address!, {
      collection: guardsAddress,
      sortBy: 'id',
      direction: 'asc'
    }),
    enabled: !!user.address && !!guardsList
  });

  const error = error1 ?? error2;
  const hasError = !!error;

  const [quantities, setQuantities] = useState<{[key: number]: number}>({});
  const handleQtyUpdated = (id: number, qty: number) => {
    setQuantities({...quantities, [id]: qty});
  }

  const [isMinting, setIsMinting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleMint = async () => {
    try {
      if (Object.values(quantities).reduce((a, b) => a + b, 0) === 0) {
        toast.error('Please select at least one guard to mint');
        return;
      }

      setIsApproving(true);
      await handleApproval();
      setIsApproving(false);
      setIsMinting(true);

      const heroesContract = new Contract(heroesAddress, abi, user.provider.getSigner());
      const ids = Object.keys(quantities);
      const amounts = Object.values(quantities);

      const gasPrice = parseUnits('5000', 'gwei');
      const gasEstimate = await heroesContract.estimateGas.mintWithGuards(ids, amounts);
      const gasLimit = gasEstimate.mul(2);
      let extra = {
        gasPrice,
        gasLimit
      };

      console.log('PARAMS', ids, amounts);
      const tx = await heroesContract.mintWithGuards(ids, amounts, extra);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
      refetch();
    } catch (e) {
      console.log(e);
      Sentry.captureException(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsMinting(false);
      setIsApproving(false);
    }
  }

  const handleApproval = async () => {
    // try {
    const guardsContract = new Contract(guardsAddress, ERC1155, user.provider.getSigner());
    const isApproved = await guardsContract.isApprovedForAll(user.address, heroesAddress);
    if (!isApproved) {
      const tx = await guardsContract.setApprovalForAll(heroesAddress, true);
      await tx.wait();
      toast.success('Successfully approved for transfer');
    }
    // } catch (error) {
    //   console.log(error);
    //   toast.error(parseErrorMessage(error));
    // }
  };

  const [totalSelected, setTotalSelected] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  useEffect(() => {
    setTotalSelected(Object.values(quantities).reduce((a, b) => a + b, 0));
    setTotalAvailable(userGuards?.data.reduce((a, b) => a + (b.balance ?? 0), 0) ?? 0);
  }, [quantities, userGuards]);

  return (
    <>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : hasError ? (
        <Box textAlign='center'>
          Error: {(error as any).message}
        </Box>
      ) : (
        <>
          <SimpleGrid gap={4} columns={{base: 1, lg:2}}>
            {guardsList?.data.map((nft, index) => (
              <RdModalBox>
                <Flex key={`${nft.address}-${nft.id}`} justify='space-between' direction={{base: 'column', sm: 'row'}} alignItems={{base: 'center', sm: 'inherit'}}>
                  <Image
                    src={nft.image}
                    maxW='150px'
                    rounded='md'
                    border='2px solid #F48F0C'
                    me={2}
                  />
                  <VStack align='end' alignItems={{base: 'center', sm: 'end'}}>
                    <Box fontWeight='bold' textAlign={{base: 'center', sm: 'end'}}>{nft.name}</Box>
                    <GuardForm
                      nft={userGuards?.data.find((n => ciEquals(nft.id, n.nftId)))}
                      isMinting={isMinting}
                      onChange={handleQtyUpdated}
                    />
                  </VStack>
                </Flex>
              </RdModalBox>
            ))}
          </SimpleGrid>
          <RdModalFooter>
            {totalAvailable > 0 ? (
              <Center>
                <RdButton
                  onClick={handleMint}
                  isLoading={isMinting || isApproving}
                  isDisabled={isMinting || isApproving}
                  loadingText={isApproving ? 'Approving' : `Minting ${totalSelected}...`}
                >
                  Mint
                </RdButton>
              </Center>
            ) : (
              <Box textAlign='center'>
                You don't have any guards to mint
              </Box>
            )}
          </RdModalFooter>
        </>
      )}
    </>
  )
}

interface GuardFormProps {
  nft?: WalletNft;
  onChange: (id: number, qty: number) => void;
  isMinting: boolean;
}

const GuardForm = ({nft, isMinting, onChange}: GuardFormProps) => {
  if (!nft) return <Box>Available: <strong>0</strong></Box>

  const [numToMint, setNumToMint] = useState(1);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 0,
      min: 0,
      max: nft.balance,
      precision: 0,
      isDisabled: isMinting,
      onChange(valueAsString, valueAsNumber) {
        setNumToMint(valueAsNumber);
        onChange(parseInt(nft.nftId), valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <>
      <Box>Available: <strong>{nft.balance ?? 0}</strong></Box>
      {!!nft.balance && nft.balance > 0 && (
        <HStack mx='auto' maxW='200px'>
          <Button {...dec}>-</Button>
          <Input {...input} />
          <Button {...inc}>+</Button>
        </HStack>
      )}
    </>
  )
}
const Heroes = () => {
  const user = useUser();

  const {data, isLoading, error, isError} = useQuery({
    queryKey: ['UserHeroes', user.address],
    queryFn: () => NextApiService.getWallet(user.address!, {
      collection: heroesAddress,
      sortBy: 'receivedTimestamp',
      direction: 'desc'
    }),
    enabled: !!user.address
  });

  return (
    <>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : isError ? (
        <Box textAlign='center'>
          Error: {(error as any).message}
        </Box>
      ) : (
        <>
          <SimpleGrid
            columns={{base: 2, sm: 3, md: 4}}
            gap={3}
          >
            {data?.data.map((nft, index) => (
              <HeroNft nft={nft} />
            ))}
          </SimpleGrid>
        </>
      )}
    </>
  )
}


const HeroNft = ({nft}: {nft: WalletNft}) => {
  return (
    <Box
      className="card eb-nft__card h-100 shadow"
      data-group
      borderWidth='1px'
      _hover={{
        borderColor:'#F48F0C',
      }}
      borderRadius='19px'
    >
      <Box
        _groupHover={{
          background:useColorModeValue('#FFFFFF', '#404040'),
          transition:'0.3s ease'
        }}
        borderRadius='15px'
        transition="0.3s ease"
        height="100%"
      >
        <Flex direction="column" height="100%">
          <div className="card-img-container position-relative">
            <Box
              _groupHover={{transform:'scale(1.05)', transition:'0.3s ease'}}
              transition="0.3s ease"
              transform="scale(1.0)"
              cursor="pointer"
            >
              <DynamicNftImage nft={nft} address={nft.nftAddress} id={nft.nftId} />
            </Box>
          </div>
          {nft.rank && typeof nft.rank === 'number' && (
            <div className="badge bg-rarity text-wrap mt-1 mx-1">Rank: #{nft.rank}</div>
          )}
          <div className="d-flex flex-column p-2 pb-1">
            <div className="mt-auto">
              <span style={{ cursor: 'pointer' }}>
                {nft.balance && nft.balance > 1 ? (
                  <Heading as="h6" size="sm">
                    {nft.name} (x{nft.balance})
                  </Heading>
                ) : (
                  <Heading as="h6" size="sm">{nft.name}</Heading>
                )}
              </span>
            </div>
          </div>
        </Flex>
      </Box>
    </Box>
  )
}