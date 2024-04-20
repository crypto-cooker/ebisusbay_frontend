import {Box, Button, Container, Flex, IconButton, useDisclosure, VStack, Wrap} from "@chakra-ui/react";
import InputBox from "@dex/components/swap/input-box";
import {ArrowDownIcon, ArrowUpDownIcon, SettingsIcon} from "@chakra-ui/icons";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import React, {useEffect} from "react";
import useSupportedTokens from "@dex/hooks/use-supported-tokens";
import {TokenBoxProvider} from "@dex/components/swap/context";
import {useAtom, useSetAtom} from "jotai";
import {
  setTokenAmountFromEth,
  setTokenAmountFromWei,
  tokenInAtom,
  tokenOutAtom,
  userTokenBalancesAtom
} from "@dex/state/swap/atom";
import {useAllTokenBalances} from "@dex/hooks/use-token-balances";
import {ciEquals} from "@market/helpers/utils";
import {useUser} from "@src/components-v2/useUser";
import AuthenticationGuard from "@src/components-v2/shared/authentication-guard";
import {Card} from "@src/components-v2/foundation/card";
import Settings from "@dex/components/swap/settings";
import {useUserSlippageTolerance} from "@dex/state/user/hooks";

export default function SwapPage() {
  const user = useUser();
  const {supportedTokens} = useSupportedTokens();
  const [tokenOut] = useAtom(tokenInAtom);
  const [tokenIn] = useAtom(tokenInAtom);
  const tokenBalances = useAllTokenBalances();
  const setUserTokenBalances = useSetAtom(userTokenBalancesAtom);
  const updateTokenAmount = useSetAtom(setTokenAmountFromWei);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [userSlippageTolerance] = useUserSlippageTolerance();

  useEffect(() => {
    setUserTokenBalances(tokenBalances);
  }, [tokenBalances]);

  const handleQuickChange = (percentage: number) => {
    if (!tokenOut.token) return;

    const userTokenBalance = tokenBalances.find((token) => ciEquals(token.address, tokenOut.token!.address));
    if (!userTokenBalance) return;

    updateTokenAmount(tokenInAtom, ((userTokenBalance.balance * BigInt(percentage)) / BigInt(100)));
  }

  return (
    <>
      <Container mt={4}>
        <Card>
          <Flex justify='space-between' mb={4}>
            <Box fontSize='xl' fontWeight='bold'>Swap</Box>
            <Box>
              <IconButton
                aria-label='Settings'
                variant='ghost'
                icon={<SettingsIcon />}
                onClick={onOpen}
              />
            </Box>
          </Flex>
          <VStack w='full' align='stretch'>
            <InputBox
              title='From'
              availableTokens={supportedTokens}
              atom={tokenInAtom}
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
              atom={tokenOutAtom}
            />
            <Box>
              <Flex justify='space-between'>
                <Box>Price</Box>
                <Box>1 CRO = 10 FRTN</Box>
              </Flex>
              <Flex justify='space-between'>
                <Box>Slippage Tolerance</Box>
                <Box>{(userSlippageTolerance / 100).toFixed(2)}%</Box>
              </Flex>
            </Box>
            <AuthenticationGuard>
              {({isConnected, connect}) => (
                <>
                  {isConnected ? (
                    <PrimaryButton
                      isDisabled={!tokenOut.amountEth && !tokenIn.amountEth}
                      size='lg'
                    >
                      Enter an amount
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton onClick={connect}>
                      Connect Wallet
                    </PrimaryButton>
                  )}
                </>
              )}
            </AuthenticationGuard>
          </VStack>
        </Card>
      </Container>
      <Settings
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}