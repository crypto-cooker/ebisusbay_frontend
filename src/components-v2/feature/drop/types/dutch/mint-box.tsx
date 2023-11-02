import {constants, Contract, ethers} from "ethers";
import {useAppSelector} from "@src/Store/hooks";
import React, {useState} from "react";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import * as Sentry from "@sentry/react";
import {parseErrorMessage} from "@src/helpers/validator";
import Fortune from "@src/Contracts/Fortune.json";
import {commify, parseUnits} from "ethers/lib/utils";
import {ApiService} from "@src/core/services/api-service";
import {Box, Button, HStack, Input, Stack, useNumberInput} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useAtom} from "jotai/index";
import {dutchAuctionDataAtom} from "@src/components-v2/feature/drop/types/dutch/atom";
import {appConfig} from "@src/Config";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";

const config = appConfig();

enum FundingType {
  NATIVE = 'native',
  ERC20 = 'erc20',
  REWARDS = 'rewards',
}

const MintBox = () => {
  const user = useAppSelector((state) => state.user);
  const [auctionData, setAuctionData] = useAtom(dutchAuctionDataAtom);

  const [mintingWithType, setMintingWithType] = useState<FundingType>();
  const [numToMint, setNumToMint] = useState(1);
  const {requestSignature} = useEnforceSigner();
  const [runAuthedFunction] = useAuthedFunction();

  const handleMint = async (fundingType: FundingType) => {
    await runAuthedFunction(async () => {
      if (!auctionData.writeContract) {
        console.log('missing write contract')
        return;
      }

      setMintingWithType(fundingType)
      try {
        const cost = await auctionData.readContract!.mintCost();
        let finalCost = cost.mul(numToMint);

        let response;
        if (fundingType === FundingType.REWARDS) {
          response = await mintWithRewards(finalCost);
        } else if (fundingType === FundingType.ERC20) {
          response = await mintWithFrtn(finalCost);
        }

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        auctionData.onUserMinted(user.address!);
      } catch (error: any) {
        Sentry.captureException(error);
        console.log(error);
        toast.error(parseErrorMessage(error));
      } finally {
        setMintingWithType(undefined);
      }
    });
  }

  const mintWithFrtn = async (finalCost: number) => {
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.getSigner());
    const allowance = await fortuneContract.allowance(user.address, auctionData.address);

    if (allowance.sub(finalCost) <= 0) {
      const approvalTx = await fortuneContract.approve(auctionData.address, constants.MaxUint256);
      await approvalTx.wait();
    }

    const gasPrice = parseUnits('5000', 'gwei');
    const gasEstimate = await auctionData.writeContract!.estimateGas.mintWithToken(numToMint);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await auctionData.writeContract!.mintWithToken(numToMint, extra);
  }

  const mintWithRewards = async (finalCost: number) => {
    const signature = await requestSignature();
    const finalCostEth = ethers.utils.formatEther(finalCost);
    const authorization = await ApiService.withoutKey().ryoshiDynasties.requestRewardsSpendAuthorization(finalCostEth, user.address!, signature);

    const gasPrice = parseUnits('5000', 'gwei');
    const gasEstimate = await auctionData.writeContract!.estimateGas.mintWithRewards(numToMint, authorization.reward, authorization.signature);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await auctionData.writeContract!.mintWithRewards(numToMint, authorization.reward, authorization.signature, extra);
  }

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: numToMint,
      min: 1,
      max: auctionData.canMint,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setNumToMint(valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <Box>
      <Box fontWeight='bold'>Your Balance</Box>
      <HStack justify='center' my={1}>
        <FortuneIcon boxSize={4} />
        <Box fontWeight='bold'>{commify(auctionData.userBalance)}</Box>
      </HStack>
      <Stack spacing={1} mt={2} maxW='170px' mx='auto'>
        <HStack mx='auto'>
          <Button {...dec}>-</Button>
          <Input {...input} />
          <Button {...inc}>+</Button>
        </HStack>
        <PrimaryButton
          onClick={() => handleMint(FundingType.ERC20)}
          disabled={mintingWithType === FundingType.ERC20}
          isLoading={mintingWithType === FundingType.ERC20}
          loadingText='Minting...'
          whiteSpace='initial'
        >
          Mint
        </PrimaryButton>
        {/*<PrimaryButton*/}
        {/*  onClick={() => handleMint(FundingType.REWARDS)}*/}
        {/*  disabled={mintingWithType === FundingType.REWARDS}*/}
        {/*  isLoading={mintingWithType === FundingType.REWARDS}*/}
        {/*  loadingText='Minting...'*/}
        {/*  whiteSpace='initial'*/}
        {/*>*/}
        {/*  Mint from Rewards*/}
        {/*</PrimaryButton>*/}
      </Stack>
    </Box>
  )
}

export default MintBox;