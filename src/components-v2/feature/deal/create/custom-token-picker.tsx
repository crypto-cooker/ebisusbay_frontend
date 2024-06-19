import React, {ChangeEvent, useState} from "react";
import {toast} from "react-toastify";
import {ciEquals, isAddress, shortAddress} from "@market/helpers/utils";
import {TitledCard} from "@src/components-v2/foundation/card";
import {
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text
} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {ethers} from "ethers";
import {BarterToken} from "@market/state/jotai/atoms/deal";
import {multicall} from "@wagmi/core";
import useCurrencyBroker from "@market/hooks/use-currency-broker";
import { wagmiConfig } from '@src/wagmi';
import { Address, erc20Abi } from 'viem';

interface CustomTokenPickerProps {
  onAdd: (token: BarterToken) => void;
}

export const CustomTokenPicker = ({onAdd}: CustomTokenPickerProps) => {
  const { knownCurrencies  } = useCurrencyBroker();
  const [tokenAddress, setTokenAddress] = useState<string>();
  const [quantity, setQuantity] = useState<string>();

  const handleAddToken = async () => {
    if (!tokenAddress) {
      toast.error('A token address is required');
      return;
    }

    if (!isAddress(tokenAddress)) {
      toast.error('Invalid token address');
      return;
    }

    if (ciEquals(tokenAddress, ethers.constants.AddressZero)) {
      toast.error('Cannot add native CRO')
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    try {
      const knownToken = knownCurrencies.find((token) => ciEquals(token.address, tokenAddress));
      if (knownToken) {
        onAdd({
          ...knownToken,
          address: knownToken.address.toLowerCase(),
          amount: Number(quantity),
        });
        return;
      }

      const tokenInfo = await multicall(wagmiConfig as any, {
        contracts: [
          {
            address: tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'name',
            args: []
          },
          {
            address: tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'symbol',
            args: []
          },
          {
            address: tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'decimals',
            args: []
          }
        ]
      });

      if (tokenInfo[2].status === 'failure') {
        toast.error('Failed to retrieve decimals');
        return;
      }

      if (tokenInfo.some((x) => x.status === 'failure')) {
        toast.error('Failed to retrieve token info');
        return;
      }

      if (tokenInfo[2].result !== 18) {
        toast.error('Currently only support tokens with 18 decimals');
        return;
      }

      onAdd({
        address: tokenAddress,
        symbol: tokenInfo[1].result ?? `CT-${shortAddress(tokenAddress)}`,
        name: tokenInfo[0].result ?? `Custom Token (${shortAddress(tokenAddress)})`,
        decimals: tokenInfo[2].result,
        image: '',
        amount: Number(quantity),
      });

    } catch (e) {
      console.log(e);
      toast.error('Could not detect decimals.');
    }
  }

  return (
    <TitledCard title='Custom Token'>
      <Text>Add any custom token to this deal. Please double check that the address is correct before adding.</Text>
      <Stack direction={{base: 'column', sm: 'row'}} mt={2}>
        <Input
          placeholder='Token Address'
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTokenAddress(e.target.value)}
          value={tokenAddress}
        />
        <NumberInput
          max={100000000000000}
          value={quantity}
          onChange={(valueAsString: string) => setQuantity(valueAsString)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
      <Flex justify='end' mt={2}>
        <PrimaryButton onClick={handleAddToken}>
          Add
        </PrimaryButton>
      </Flex>
    </TitledCard>
  )
}