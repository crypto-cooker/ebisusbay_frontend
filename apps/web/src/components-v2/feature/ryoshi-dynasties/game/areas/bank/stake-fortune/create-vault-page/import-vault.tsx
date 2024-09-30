import {Box, Center, Flex, HStack, Image, Spinner, Tag, Text, VStack, Wrap} from "@chakra-ui/react";
import RdButton from "../../../../../components/rd-button";
import React, {useContext, useState} from "react";
import {
  RyoshiDynastiesContext,
  RyoshiDynastiesContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/contexts/rd-context";
import {
  BankStakeTokenContext,
  BankStakeTokenContextProps
} from "@src/components-v2/feature/ryoshi-dynasties/game/areas/bank/stake-fortune/context";
import {useAppChainConfig} from "@src/config/hooks";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useSwitchNetwork} from "@eb-pancakeswap-web/hooks/useSwitchNetwork";
import {useWriteContract} from "wagmi";
import {useUser} from "@src/components-v2/useUser";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {ethers} from "ethers";
import {createSuccessfulTransactionToastContent, findNextLowestNumber, round} from "@market/helpers/utils";
import {toast} from "react-toastify";
import Bank from "@src/global/contracts/Bank.json";
import {parseErrorMessage} from "@src/helpers/validator";
import {RdModalBox} from "@src/components-v2/feature/ryoshi-dynasties/components/rd-modal";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {commify} from "ethers/lib/utils";
import ImageService from "@src/core/services/image";

interface ImportVaultFormProps {
  onComplete: () => void;
}

export const ImportVaultForm = ({onComplete}: ImportVaultFormProps) => {
  const { config: rdConfig } = useContext(RyoshiDynastiesContext) as RyoshiDynastiesContextProps;
  const { chainId: bankChainId } = useContext(BankStakeTokenContext) as BankStakeTokenContextProps;
  const { config: chainConfig } = useAppChainConfig(bankChainId);

  const { chainId: activeChainId} = useActiveChainId();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { writeContractAsync } = useWriteContract();
  const [isExecuting, setIsExecuting] = useState(false);
  const user = useUser();
  const [selectedVaultId, setSelectedVaultId] = useState<string>();
  const availableAprs = rdConfig.bank.staking.fortune.apr as any;


  const { data: vaultNfts, isLoading, isError, error } = useQuery({
    queryKey: ['UserVaultNfts', user.address],
    queryFn: async () => {
      const nfts = await ApiService.withoutKey().getWallet(user.address!, {
        wallet: user.address!,
        collection: [chainConfig.contracts.vaultNft]
      });

      return nfts.data.map((nft) => {
        const amount = nft.attributes.find(a => a.trait_type === 'Amount');
        const formattedAmount = amount ? Number(ethers.utils.formatEther(amount.value)) : 0;

        const length = nft.attributes.find(a => a.trait_type === 'Deposit Length');
        const lengthDays = length ? Number(length.value) / 86400 : 0;
        const start = nft.attributes.find(a => a.trait_type === 'Start Time');
        const daysRemaining = round(lengthDays - ((Date.now() / 1000) - Number(start?.value)) / 86400, 1);
        // const endTime = Number(start?.value) + Number(length?.value);

        const numTerms = Math.floor(lengthDays / rdConfig.bank.staking.fortune.termLength);
        const aprKey = findNextLowestNumber(Object.keys(availableAprs), numTerms);
        const baseApr = (availableAprs[aprKey] ?? availableAprs[1]) * 100;
        // const endDate = moment(endTime * 1000).format("MMM D yyyy");

        const mitamaTroopsRatio = rdConfig.bank.staking.fortune.mitamaTroopsRatio;
        const mitama = Math.floor((formattedAmount * lengthDays) / 1080);

        let troops = Math.floor(mitama / mitamaTroopsRatio);
        if (troops < 1 && formattedAmount > 0) troops = 1;

        return {
          ...nft,
          amount: formattedAmount,
          length: lengthDays,
          daysRemaining,
          baseApr,
          troops,
          mitama,
          start: Number(start?.value)
        }
      });
    },
    enabled: !!user.address
  });

  const handleConvert = async () => {
    if (!selectedVaultId) {
      toast.error('Please select a vault');
      return;
    }

    try {
      if (activeChainId !== bankChainId) {
        await switchNetworkAsync(bankChainId);
        return;
      }

      const check = await ApiService.withoutKey().ryoshiDynasties.checkBlacklistStatus(user.address!);
      if (check.data.blacklisted === true) {
        return;
      };
      setIsExecuting(true);

      const txHash = await writeContractAsync({
        address: chainConfig.contracts.bank,
        abi: Bank,
        functionName: 'installBox',
        args: [selectedVaultId],
      });

      toast.success(createSuccessfulTransactionToastContent(txHash, bankChainId));
      onComplete();
    } catch (error: any) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    } finally {
      setIsExecuting(false);
    }
  }

  const handleSelectVault = async (id: string) => {
    setSelectedVaultId(selectedVaultId === id ? undefined : id);
  }

  return (
    <Box px={2}>
      <Text textAlign='center' fontSize={14} py={2}>Once converted, your NFT will be available in your bank. Select a vault below and then click <strong>Convert</strong>.</Text>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : isError ? (
        <Box textAlign='center'>
          Error: {(error as any).message}
        </Box>
      ) : !!vaultNfts && vaultNfts.length > 0 ? (
        <>
          <Box>
            <VStack>
              {vaultNfts.map((nft) => (
                <RdModalBox
                  w='full'
                  cursor='pointer'
                  border={`2px solid ${selectedVaultId === nft.nftId ? '#F48F0C' : 'transparent'}`}
                  _hover={{
                    border: '2px solid #F48F0C'
                  }}
                  onClick={() => handleSelectVault(nft.nftId)}
                >
                  <Flex direction='column' w='full' align='start'>
                    <Flex w='full' align='center'>
                      <Box flex='1' textAlign='left' my='auto' minW='127px'>
                        <Text fontSize='xs' color="#aaa">{nft.name}</Text>
                        <Box fontWeight='bold'>{nft.length} days ({nft.daysRemaining} days remaining)</Box>
                      </Box>
                      <Box>
                        <VStack align='end' spacing={2} fontSize='sm'>
                          <HStack fontWeight='bold'>
                            <FortuneIcon boxSize={6} />
                            <Box>{commify(round(nft.amount))}</Box>
                          </HStack>
                          <Wrap spacing={2} justify='flex-end'>
                            <Tag variant='outline'>
                              {round(nft.baseApr, 2)}%
                            </Tag>
                            <Tag variant='outline'>
                              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/troops.png').convert()}
                                     alt="troopsIcon" boxSize={4}/>
                              <Box ms={1}>
                                {commify(nft.troops)}
                              </Box>
                            </Tag>
                            <Tag variant='outline'>
                              <Image src={ImageService.translate('/img/ryoshi-dynasties/icons/mitama.png').convert()}
                                     alt="troopsIcon" boxSize={4}/>
                              <Box ms={1}>
                                {commify(nft.mitama)}
                              </Box>
                            </Tag>
                          </Wrap>
                        </VStack>
                      </Box>
                    </Flex>
                  </Flex>
                </RdModalBox>
              ))}
            </VStack>
          </Box>
          <Box ps='20px' textAlign='center' mt={4}>
            <RdButton
              fontSize={{base: 'xl', sm: '2xl'}}
              stickyIcon={true}
              isLoading={isExecuting}
              isDisabled={isExecuting || !selectedVaultId}
              onClick={handleConvert}
            >
              Convert
            </RdButton>
          </Box>
        </>
      ) : (
        <Box textAlign='center' mt={4}>
          No vault NFTs found
        </Box>
      )}
    </Box>
  )
}

export const ImportVaultComplete = ({onReturn}: {onReturn: () => void}) => {
  return (
    <Box p={4}>
      <Box textAlign='center'>
        Vault imported successfully! The vault is now visible in the Bank. Any bonus APR will be automatically applied.
      </Box>
      <Box textAlign='center' mt={8} mx={2}>
        <RdButton size={{base: 'md', md: 'lg'}} onClick={onReturn} w={{base: 'full', sm: 'auto'}}>
          Back To Vaults
        </RdButton>
      </Box>
    </Box>
  )
}