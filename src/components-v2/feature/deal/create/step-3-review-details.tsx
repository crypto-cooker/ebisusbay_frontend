import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Select,
  SimpleGrid,
  Text,
  VStack
} from "@chakra-ui/react";
import React, {ChangeEvent, useEffect, useState} from "react";
import {TitledCard} from "@src/components-v2/foundation/card";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {BarterNft, BarterToken} from "@src/jotai/atoms/deal";
import {multicall} from "@wagmi/core";
import {useUser} from "@src/components-v2/useUser";
import {appConfig} from "@src/Config";
import {Address, erc20ABI, erc721ABI} from "wagmi";
import {ContractFunctionConfig} from "viem";
import {ciEquals} from "@src/utils";
import {Contract, ethers} from "ethers";
import {ERC20, ERC721} from "@src/Contracts/Abis";
import {parseErrorMessage} from "@src/helpers/validator";
import {toast} from "react-toastify";

const config = appConfig();

interface Step3ReviewDetailsProps {
  address: string;
  onConfirm: () => void;
}

export const Step3ReviewDetails = ({address, onConfirm}: Step3ReviewDetailsProps) => {
  const user = useUser();
  const { setDuration, barterState } = useBarterDeal();
  const [approvals, setApprovals] = useState<{[key: string]: boolean}>({});

  const handleExpirationDateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDuration(parseInt(e.target.value));
  }

  const checkApprovalStatuses = async () => {

    const nftContracts: ContractFunctionConfig[] = barterState.maker.nfts.map(nft => ({
      address: nft.nftAddress.toLowerCase() as Address,
      abi: erc721ABI,
      functionName: 'isApprovedForAll',
      args: [user.address, config.contracts.market],
    }));

    const tokenContracts: ContractFunctionConfig[] = barterState.maker.erc20.map(token => {
      let address = token.address;
      if (ciEquals(address, ethers.constants.AddressZero)) {
        address = config.tokens.wcro.address;
      }

      return {
        address: address.toLowerCase() as Address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [user.address, config.contracts.market],
      };
    });

    const data = await multicall({
      contracts: nftContracts.concat(tokenContracts),
    });

    let sumOfCros = {
      approved: 0,
      requires: 0
    };
    const _approvals = data.reduce((acc, item, index) => {
      const nftsLength = nftContracts.length;
      const erc20sLength = tokenContracts.length;
      const isNft = index < nftsLength;
      const isToken = index >= nftsLength;

      if (isNft) {
        const key = nftContracts[index].address;
        acc[key.toLowerCase()] = item.result as boolean;
      } else if (isToken) {
        const key = tokenContracts[index - nftsLength].address;
        const approvedAmount = Number(ethers.utils.formatEther(item.result as ethers.BigNumber));
        const requiredAmount = barterState.maker.erc20[index - nftsLength].amount;
        if (ciEquals(key, ethers.constants.AddressZero) || ciEquals(key, config.tokens.wcro.address)) {
          sumOfCros.approved += approvedAmount;
          sumOfCros.requires += requiredAmount;
        }
        acc[key.toLowerCase()] = approvedAmount >= requiredAmount;
      }

      return acc;
    }, {} as {[key: string]: boolean});

    // Combine CRO and WCRO for a single wrapped approval status
    if (_approvals[config.tokens.wcro.address.toLowerCase()]) {
      _approvals[config.tokens.wcro.address.toLowerCase()] = sumOfCros.approved >= sumOfCros.requires;
    }

    console.log(data);
    console.log(_approvals);
    setApprovals(_approvals);
  }

  const updateApproval = (address: string, value: boolean | number) => {
    if (ciEquals(address, ethers.constants.AddressZero)) {
      address = config.tokens.wcro.address;
    }

    setApprovals({
      ...approvals,
      [address.toLowerCase()]: true,
    });
  }

  useEffect(() => {
    checkApprovalStatuses();
  }, []);

  const requiresApprovals = Object.values(approvals).filter(approval => !approval).length > 0;
  const requiresCroWrapping = barterState.maker.erc20.some(token => ciEquals(token.address, ethers.constants.AddressZero));

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 3: Review details
        </Heading>
        <Text>
          Set how long this deal should be active, then review selections and click the Confirm button at the bottom to create the deal request.
        </Text>
      </Box>

      <Container>
        <TitledCard title='Additional Details'>
          <VStack align='start'>
            <Box>
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <Select
                  defaultValue={604800000}
                  onChange={handleExpirationDateChange}
                  maxW='200px'
                >
                  {expirationDatesValues.map((time) => (
                    <option value={time.value}>{time.label}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </VStack>
        </TitledCard>
        {requiresCroWrapping && (
          <TitledCard title='CRO Transfers' mt={2}>
            <Text>This deal contains CRO and will be automatically wrapped to WCRO</Text>
          </TitledCard>
        )}
        {requiresApprovals && (
          <TitledCard title='Approvals' mt={2}>
            <Text>Some approvals are required so that the contract can successfully transfer assets on your behalf once the deal is accepted. Please review these below</Text>
            <SimpleGrid columns={4} mt={4} gap={2}>
              {barterState.maker.nfts.filter((nft) => !approvals?.[nft.nftAddress.toLowerCase()]).map((nft) => (
                <GridItem key={nft.nftAddress}>
                  <NftApprovalButton nft={nft} onApproved={updateApproval} />
                </GridItem>
              ))}
              {barterState.maker.erc20.filter((token) => !approvals?.[token.address.toLowerCase()]).map((token) => (
                <GridItem key={token.address}>
                  <Erc20ApprovalButton token={token} onApproved={updateApproval} />
                </GridItem>
              ))}
            </SimpleGrid>
          </TitledCard>
        )}
      </Container>
    </>
  )
}

const NftApprovalButton = ({nft, onApproved}: {nft: BarterNft, onApproved: (address: string, value: boolean) => void}) => {
  const user = useUser();
  const [isApproving, setIsApproving] = useState(false);

  const handleApproval = async () => {
    try {
      setIsApproving(true);
      const contract = new Contract(nft.nftAddress, ERC721, user.provider.getSigner());
      const tx = await contract.setApprovalForAll(config.contracts.market, true);
      await tx.wait();
      toast.success('Approval successful');
      onApproved(nft.nftAddress, true);
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <Flex justify='space-between' direction='column' h='full'>
      <Box>{nft.name}</Box>
      <PrimaryButton
        onClick={handleApproval}
        isLoading={isApproving}
        isDisabled={isApproving}
      >
        Approve
      </PrimaryButton>
    </Flex>
  )
}

const Erc20ApprovalButton = ({token, onApproved}: {token: BarterToken, onApproved: (address: string, value: number) => void}) => {
  const user = useUser();
  const [isApproving, setIsApproving] = useState(false);

  const handleApproval = async () => {
    try {
      setIsApproving(true);
      const approvalAmount = ethers.utils.parseEther(token.amount.toString());
      const contract = new Contract(token.address, ERC20, user.provider.getSigner());
      console.log('APPROVE', token.address, config.contracts.market, approvalAmount)
      const tx = await contract.approve(config.contracts.market, approvalAmount);
      await tx.wait();
      toast.success('Approval successful');
      onApproved(token.address, Number(approvalAmount));
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <Flex justify='space-between' direction='column' h='full'>
      <Box>{token.name}</Box>
      <PrimaryButton
        onClick={handleApproval}
        isLoading={isApproving}
        isDisabled={isApproving}
      >
        Approve
      </PrimaryButton>
    </Flex>
  )
}

const expirationDatesValues = [
  {
    value: 3600000,
    label: '1 hour'
  },
  {
    value: 10800000,
    label: '3 hours'
  },
  {
    value: 21600000,
    label: '6 hours'
  },
  {
    value: 86400000,
    label: '1 day'
  },
  {
    value: 259200000,
    label: '3 days'
  },
  {
    value: 604800000,
    label: '1 week'
  },
  {
    value: 1296000000,
    label: '2 weeks'
  },
  {
    value: 2592000000,
    label: '1 month'
  },
  {
    value: 7776000000,
    label: '3 month'
  },
  {
    value: 15552000000,
    label: '6 months'
  },
]