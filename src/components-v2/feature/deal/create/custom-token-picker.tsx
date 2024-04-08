import React, {ChangeEvent, useState} from "react";
import {toast} from "react-toastify";
import {ciEquals, isAddress, shortAddress} from "@src/utils";
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
import {BarterToken} from "@src/jotai/atoms/deal";
import {multicall} from "@wagmi/core";
import {Address, erc20ABI} from "wagmi";
import useCurrencyBroker from "@src/hooks/use-currency-broker";

interface CustomTokenPickerProps {
  onAdd: (token: BarterToken) => void;
}

export const CustomTokenPicker = ({onAdd}: CustomTokenPickerProps) => {
  const { allERC20Currencies  } = useCurrencyBroker();
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
      const whitelistedToken = allERC20Currencies.find((token) => ciEquals(token.address, tokenAddress));
      if (whitelistedToken) {
        onAdd({
          ...whitelistedToken,
          amount: Math.floor(parseInt(quantity)),
        });
        return;
      }

      const tokenInfo = await multicall({
        contracts: [
          {
            address: tokenAddress as Address,
            abi: erc20ABI,
            functionName: 'name'
          },
          {
            address: tokenAddress as Address,
            abi: erc20ABI,
            functionName: 'symbol'
          },
          {
            address: tokenAddress as Address,
            abi: erc20ABI,
            functionName: 'decimals'
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

      onAdd({
        address: tokenAddress,
        symbol: tokenInfo[1].result ?? `CT-${shortAddress(tokenAddress)}`,
        name: tokenInfo[0].result ?? `Custom Token (${shortAddress(tokenAddress)})`,
        decimals: tokenInfo[2].result,
        image: '',
        amount: Math.floor(parseInt(quantity)),
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
          precision={0}
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