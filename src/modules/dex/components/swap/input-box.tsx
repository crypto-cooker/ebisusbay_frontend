import {Card} from "@src/components-v2/foundation/card";
import {Box, Button, Flex, HStack, Image, Input, NumberInput, NumberInputField, useDisclosure} from "@chakra-ui/react";
import {DexToken, DexTokenBalance} from "@dex/types/types";
import {ChangeEvent, useEffect, useState} from "react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {ResponsiveChooseTokenDialog} from "@dex/components/swap/responsive-choose-token-dialog";
import useSupportedTokens from "@dex/imported/hooks/use-supported-tokens";
import {ciEquals} from "@market/helpers/utils";
import {ethers} from "ethers";
import {PrimitiveAtom, useAtom, useAtomValue, useSetAtom} from "jotai";
import {setTokenAmountFromEth, setTokenAtom, SwapBoxToken, userTokenBalancesAtom} from "@dex/imported/state/swap/atom";
import {formatUnits, parseUnits} from "viem";

interface InputBoxProps {
  title: string;
  availableTokens: DexToken[];
  atom: PrimitiveAtom<SwapBoxToken>;
}

export default function InputBox({title, availableTokens, atom}: InputBoxProps) {
  const tokenBalances = useAtomValue(userTokenBalancesAtom);
  const {supportedTokens, commonBases} = useSupportedTokens();
  const [userTokenBalance, setUserTokenBalance] = useState<DexTokenBalance>();
  const [selectedToken, setSelectedToken] = useAtom(atom);
  const updateTokenAmount = useSetAtom(setTokenAmountFromEth);
  const setToken = useSetAtom(setTokenAtom);

  const {isOpen, onOpen, onClose} = useDisclosure();

  const handleSelectToken = async (token: DexToken) => {
    setToken(selectedToken.key, token);
    onClose();
  }

  const handleChangeAmount = (valueAsString: string, valueAsNumber: number) => {
    updateTokenAmount(atom, valueAsString);
  }

  // Set the token balance once item has been selected
  useEffect(() => {
    if (!selectedToken.token) return;

    const tokenBalance = tokenBalances.find((token) => ciEquals(token.address, selectedToken.token!.address));
    setUserTokenBalance(tokenBalance);
  }, [selectedToken, tokenBalances]);

  // Set the default item
  useEffect(() => {
    if (availableTokens.length > 0) {
      setSelectedToken((prev) => ({...prev, token: availableTokens[0]}));
    }
  }, [setSelectedToken, supportedTokens]);

  return (
    <>
      <Card>
        <Flex justify='space-between' fontSize='sm'>
          <Box>{title}</Box>
          <Box>Balance: {userTokenBalance ? formatUnits(userTokenBalance.balance, userTokenBalance.decimals) : 0}</Box>
        </Flex>
        <HStack>
          <NumberInput
            variant='unstyled'
            value={selectedToken.amountEth}
            onChange={handleChangeAmount}
            flex={1}
          >
            <NumberInputField
              fontSize='2xl'
              placeholder='0.0'
            />
          </NumberInput>

          <Button onClick={onOpen}>
            <HStack>
              <Box as='span' minW='30px'>
                <Image w='30px' src={selectedToken.token?.logoURI} />
              </Box>
              <span>{selectedToken.token?.symbol}</span>
              <ChevronDownIcon />
            </HStack>
          </Button>
        </HStack>
      </Card>
      <ResponsiveChooseTokenDialog
        isOpen={isOpen}
        onClose={onClose}
        commonBases={commonBases}
        tokens={supportedTokens}
        modalProps={{size: 'lg', isCentered: false}}
        onSelectToken={handleSelectToken}
      />
    </>
  )
}