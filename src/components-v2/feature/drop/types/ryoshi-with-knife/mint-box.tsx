import {Contract, ethers} from "ethers";
import React, {useMemo, useState} from "react";
import useEnforceSigner from "@src/Components/Account/Settings/hooks/useEnforceSigner";
import useAuthedFunction from "@src/hooks/useAuthedFunction";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import * as Sentry from "@sentry/react";
import {parseErrorMessage} from "@src/helpers/validator";
import Fortune from "@src/Contracts/Fortune.json";
import {parseUnits} from "ethers/lib/utils";
import {Box, Button, HStack, Input, Stack, useNumberInput} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useAtom} from "jotai/index";
import {appConfig} from "@src/Config";
import {useUser} from "@src/components-v2/useUser";
import {rwkDataAtom} from "@src/components-v2/feature/drop/types/ryoshi-with-knife/atom";

const config = appConfig();
const maxPerAddress = 10000;

enum FundingType {
  NATIVE = 'native',
  ERC20 = 'erc20',
  REWARDS = 'rewards',
}

const MintBox = () => {
  const user = useUser();
  const [rwkData, setRwkData] = useAtom(rwkDataAtom);

  const [mintingWithType, setMintingWithType] = useState<FundingType>();
  const [amountToContribute, setAmountToContribute] = useState(100);
  const {requestSignature} = useEnforceSigner();
  const [runAuthedFunction] = useAuthedFunction();

  const handleMint = async (fundingType: FundingType) => {
    await runAuthedFunction(async () => {
      if (!rwkData.writeContract) {
        console.log('missing write contract')
        return;
      }

      setMintingWithType(fundingType)
      try {
        // const cost = await rwkData.readContract!.mintCost();
        let finalCost = amountToContribute;

        let response;
        // if (fundingType === FundingType.REWARDS) {
        //   response = await mintWithRewards(finalCost);
        // } else if (fundingType === FundingType.ERC20) {
        //   response = await mintWithFrtn(finalCost);
        // }
        response = await mintWithFrtn(finalCost);

        const receipt = await response.wait();
        toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));

        rwkData.onUserMinted(user.address!);
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
    const finalCostWei = ethers.utils.parseEther(finalCost.toString());
    const fortuneContract = new Contract(config.contracts.fortune, Fortune, user.provider.signer);
    const allowance = await fortuneContract.allowance(user.address, rwkData.address);

    if (allowance.sub(finalCostWei) <= 0) {
      const approvalTx = await fortuneContract.approve(rwkData.address, ethers.utils.parseEther(maxPerAddress.toString()));
      await approvalTx.wait();
    }

    const gasPrice = parseUnits('5000', 'gwei');
    const gasEstimate = await rwkData.writeContract!.estimateGas.contribute(finalCostWei);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return await rwkData.writeContract!.contribute(finalCostWei, extra);
  }

  // const mintWithRewards = async (finalCost: number) => {
  //   const signature = await requestSignature();
  //   const finalCostEth = ethers.utils.formatEther(finalCost);
  //   const authorization = await ApiService.withoutKey().ryoshiDynasties.requestRewardsSpendAuthorization(
  //     finalCostEth,
  //     numToMint,
  //     `Drop: ${rwkData.drop?.title}`,
  //     user.address!,
  //     signature
  //   );
  //
  //   const gasPrice = parseUnits('5000', 'gwei');
  //   const gasEstimate = await rwkData.writeContract!.estimateGas.mintWithRewards(numToMint, authorization.reward, authorization.signature);
  //   const gasLimit = gasEstimate.mul(2);
  //   let extra = {
  //     gasPrice,
  //     gasLimit
  //   };
  //
  //   return await rwkData.writeContract!.mintWithRewards(numToMint, authorization.reward, authorization.signature, extra);
  // }

  const inputLimit = useMemo(() => {
    let amount = maxPerAddress;
    if (rwkData.availableTokenCount < maxPerAddress) {
      amount = rwkData.availableTokenCount;
    }
    if (maxPerAddress - rwkData.userContribution < maxPerAddress) {
      amount = maxPerAddress - rwkData.userContribution;
    }
    if (amount < 0) amount = 0;

    return amount;
  }, [rwkData.userContribution, rwkData.availableTokenCount, maxPerAddress]);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 100,
      defaultValue: amountToContribute,
      min: 1,
      max: inputLimit,
      precision: 0,
      onChange(valueAsString, valueAsNumber) {
        setAmountToContribute(valueAsNumber);
      }
    })
  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  return (
    <Box>
      {/*<Box fontWeight='bold'>Your Balance</Box>*/}
      {/*<HStack justify='center' my={1}>*/}
      {/*  <FortuneIcon boxSize={4} />*/}
      {/*  <Box fontWeight='bold'>{commify(rwkData.userBalance)}</Box>*/}
      {/*</HStack>*/}
      <Stack spacing={1} mt={2} maxW='200px' mx='auto'>
        <HStack mx='auto'>
          <Button {...dec}>-</Button>
          <Input {...input} />
          <Button {...inc}>+</Button>
        </HStack>
        <PrimaryButton
          onClick={() => handleMint(FundingType.ERC20)}
          isDisabled={mintingWithType === FundingType.ERC20 || amountToContribute < 1}
          isLoading={mintingWithType === FundingType.ERC20}
          loadingText='Contributing...'
          whiteSpace='initial'
        >
          Go Fish
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