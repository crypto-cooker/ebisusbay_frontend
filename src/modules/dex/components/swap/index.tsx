import {Box, Button, Container, IconButton, VStack, Wrap} from "@chakra-ui/react";
import InputBox from "@dex/components/swap/input-box";
import {ArrowDownIcon} from "@chakra-ui/icons";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import React, {useEffect} from "react";
import useSupportedTokens from "@dex/hooks/use-supported-tokens";
import {TokenBoxProvider} from "@dex/components/swap/context";
import {useAtom, useSetAtom} from "jotai";
import {
  setTokenAmountFromEth,
  setTokenAmountFromWei,
  tokenAAtom,
  tokenBAtom,
  userTokenBalancesAtom
} from "@dex/components/swap/store";
import {useAllTokenBalances} from "@dex/hooks/use-token-balances";
import {ciEquals} from "@market/helpers/utils";

export default function SwapPage() {
  const {supportedTokens} = useSupportedTokens();
  const [tokenA, setTokenA] = useAtom(tokenAAtom);
  const tokenBalances = useAllTokenBalances();
  const setUserTokenBalances = useSetAtom(userTokenBalancesAtom);
  const updateTokenAmount = useSetAtom(setTokenAmountFromWei);

  useEffect(() => {
    setUserTokenBalances(tokenBalances);
  }, [tokenBalances]);

  const handleQuickChange = (percentage: number) => {
    if (!tokenA.token) return;

    const userTokenBalance = tokenBalances.find((token) => ciEquals(token.address, tokenA.token!.address));
    if (!userTokenBalance) return;

    updateTokenAmount(tokenAAtom, ((userTokenBalance.balance * BigInt(percentage)) / BigInt(100)));
  }

  return (
    <>
      <Container mt={4}>
        {/*<Card>*/}
        <Box textAlign='center' mb={4}>
          <Box fontSize='xl' fontWeight='bold'>Ryoshi Swap</Box>
          <Box>Trade tokens instantly with low fees</Box>
        </Box>
        <VStack w='full' align='stretch'>
          <InputBox
            title='From'
            availableTokens={supportedTokens}
            atom={tokenAAtom}
          />
          <Wrap justify='center'>
            <Button onClick={() => handleQuickChange(25)}>25%</Button>
            <Button onClick={() => handleQuickChange(50)}>50%</Button>
            <Button onClick={() => handleQuickChange(75)}>75%</Button>
            <Button onClick={() => handleQuickChange(100)}>Max</Button>
          </Wrap>
          <Box textAlign='center'>
            <IconButton aria-label='Swap to' icon={<ArrowDownIcon />} w='40px' />
          </Box>
          <InputBox
            title='To (estimated)'
            availableTokens={supportedTokens}
            atom={tokenBAtom}
          />
          <PrimaryButton>
            Enter an amount
          </PrimaryButton>
        </VStack>
        {/*</Card>*/}
      </Container>
    </>
  );
}