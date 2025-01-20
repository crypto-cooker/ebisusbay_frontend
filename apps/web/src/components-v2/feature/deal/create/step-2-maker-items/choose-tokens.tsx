import { useUser } from '@src/components-v2/useUser';
import useBarterDeal from '@src/components-v2/feature/deal/use-barter-deal';
import React, { useCallback, useMemo, useState } from 'react';
import ReactSelect, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import { ciEquals, isWrappedNative, round } from '@market/helpers/utils';
import { Contract, ethers } from 'ethers';
import WCRO from '@src/global/contracts/WCRO.json';
import { parseErrorMessage } from '@src/helpers/validator';
import { getTheme } from '@src/global/theme/theme';
import {
  Box,
  Container,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
  VStack
} from '@chakra-ui/react';
import { TitledCard } from '@src/components-v2/foundation/card';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import { BarterToken } from '@market/state/jotai/atoms/deal';
import { CustomTokenPicker } from '@src/components-v2/feature/deal/create/custom-token-picker';
import { commify } from 'ethers/lib/utils';
import { useBalance, useReadContract } from 'wagmi';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import { Address, erc20Abi } from 'viem';
import { useActiveChainId } from '@eb-pancakeswap-web/hooks/useActiveChainId';
import { useDealsTokens } from '@src/global/hooks/use-supported-tokens';
import { CmsToken } from '@src/components-v2/global-data-fetcher';
import { getAppChainConfig } from '@src/config/hooks';


export const ChooseTokensTab = ({address}: {address: string}) => {
  const { toggleOfferERC20 } = useBarterDeal();

  const handleAddCustomToken = (token: BarterToken) => {
    toggleOfferERC20(token);
  }

  return (
    <Container>
      <Stack spacing={4}>
        <WhitelistedTokenPicker balanceCheckAddress={address} />
        <CustomTokenPicker onAdd={handleAddCustomToken} />
      </Stack>
    </Container>
  )
}

const WhitelistedTokenPicker = ({balanceCheckAddress}: {balanceCheckAddress: string}) => {
  const user = useUser();
  const { chainId: userChainId } = useActiveChainId();
  const { toggleOfferERC20, barterState } = useBarterDeal();
  const chainId = barterState.chainId;
  const { namedTokens } = getAppChainConfig(barterState.chainId);

  const { tokens: dealTokens } = useDealsTokens(chainId);
  const [quantity, setQuantity] = useState<string>();
  const [isWrapping, setIsWrapping] = useState(false);

  const sortedWhitelistedERC20DealCurrencies = dealTokens.sort((a, b) => {
    // Place FRTN first
    if (ciEquals(a.symbol, namedTokens.frtn.symbol)) return -1;
    if (ciEquals(b.symbol, namedTokens.frtn.symbol)) return 1;

    // Place WCRO second
    if (ciEquals(a.symbol, namedTokens.wrappedNative.symbol)) return -1;
    if (ciEquals(b.symbol, namedTokens.wrappedNative.symbol)) return 1;

    // Place USDC third
    if (ciEquals(a.symbol, namedTokens.usdc.symbol)) return -1;
    if (ciEquals(b.symbol, namedTokens.usdc.symbol)) return 1;

    // Alphabetically sort the rest
    return a.symbol.localeCompare(b.symbol);
  });

  const [selectedCurrency, setSelectedCurrency] = useState<CmsToken>(dealTokens[0]);
  const isWrappedNativeSelected = isWrappedNative(selectedCurrency.address, barterState.chainId);

  const { data: tokenBalanceData, isLoading: isTokenBalanceLoading, refetch: refetchTokenBalance } = useReadContract({
    address: selectedCurrency?.address as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [balanceCheckAddress as `0x${string}`],
    chainId,
    query: {
      enabled: !!selectedCurrency
    }
  })

  const { data: nativeBalanceData, isLoading: isNativeBalanceLoading, refetch: refetchNativeBalance } = useBalance({
    address: balanceCheckAddress as `0x${string}`,
    chainId,
    query: {
      enabled: !!selectedCurrency && isWrappedNativeSelected
    }
  })

  const isLoading = isTokenBalanceLoading || isNativeBalanceLoading

  const native = useMemo(() => {
    if (!isWrappedNativeSelected || !nativeBalanceData) return 0
    return Number(ethers.utils.formatEther(nativeBalanceData.value))
  }, [nativeBalanceData, selectedCurrency, isWrappedNativeSelected])

  const selected = useMemo(() => {
    if (!tokenBalanceData) return 0
    return Number(ethers.utils.formatUnits(tokenBalanceData.toString(), selectedCurrency.decimals))
  }, [tokenBalanceData, selectedCurrency])

  const availableBalance = { native, selected };

  const handleCurrencyChange = useCallback((currency: SingleValue<CmsToken>) => {
    if (!currency) return;

    setSelectedCurrency(currency);
  }, [selectedCurrency]);

  const handleAddCurrency = () => {
    if (!selectedCurrency) {
      toast.error('A currency is required');
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    toggleOfferERC20({
      ...selectedCurrency,
      name: selectedCurrency.name!,
      chainId,
      amount: Number(quantity),
    });
  }

  const handleWrapCro = async () => {
    if (!selectedCurrency) {
      toast.error('A currency is required');
      return;
    }

    if (!isWrappedNativeSelected) {
      toast.error(`${namedTokens.native.symbol} must be selected for this action`);
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    if (userChainId !== chainId) {
      toast.error('Switch wallet to correct deal chain');
      return;
    }

    try {
      setIsWrapping(true);
      const amountInWei = ethers.utils.parseEther(quantity);
      const contract = new Contract(namedTokens.wrappedNative.address, WCRO, user.provider.signer)
      const tx = await contract.deposit({ value: amountInWei });
      await tx.wait();

      toast.success(`${namedTokens.native.symbol} wrapped successfully to ${namedTokens.wrappedNative.symbol}`);
      toggleOfferERC20({
        ...selectedCurrency,
        name: selectedCurrency.name!,
        chainId,
        amount: Math.floor(parseInt(quantity)),
      });
      refetchNativeBalance();
      refetchTokenBalance();
    } catch (e) {
      console.log(e);
      toast.error(parseErrorMessage(e));
    } finally {
      setIsWrapping(false);
    }
  }

  const userTheme = user.theme;
  const customStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
    option: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        background: '#eee',
        color: '#000',
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: 0,
    }),
    singleValue: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3
    }),
    control: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 1,
      minWidth: '132px',
      borderColor: 'none'
    }),
  };

  return (
    <TitledCard title='Available Tokens'>
      <Stack direction={{base: 'column', sm: 'row'}}>
        <ReactSelect
          isSearchable={false}
          menuPortalTarget={document.body} menuPosition={'fixed'}
          styles={customStyles}
          options={sortedWhitelistedERC20DealCurrencies}
          formatOptionLabel={({ symbol, address, chainId }) => (
            <HStack>
              <CurrencyLogoByAddress address={address} chainId={chainId}/>
              <span>{symbol}</span>
            </HStack>
          )}
          value={selectedCurrency}
          defaultValue={sortedWhitelistedERC20DealCurrencies[0]}
          onChange={handleCurrencyChange}
        />
        <NumberInput
          value={quantity}
          max={100000000000000}
          onChange={(valueAsString: string) => setQuantity(valueAsString)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Stack>
      <Stack direction={{base: 'column', sm: 'row'}} justify='space-between' mt={2}>
        <Box mt='auto'>
          {!!selectedCurrency && (
            <VStack align='start' spacing={0}>
              {!!availableBalance && availableBalance.native > 0 && (
                <HStack fontSize='sm'>
                  <Box fontWeight='bold'>{namedTokens.native.symbol} Balance:</Box>
                  <Box>{isLoading ? <Spinner size='sm' /> : commify(round(availableBalance.native || 0))}</Box>
                </HStack>
              )}
              <HStack fontSize='sm'>
                <Box fontWeight='bold'>Balance:</Box>
                <Box>{isLoading ? <Spinner size='sm' /> : commify(availableBalance?.selected || 0)}</Box>
              </HStack>
            </VStack>
          )}
        </Box>
        <Stack direction={{base: 'column', sm: 'row'}} justify='end' mt={2}>
          {isWrappedNativeSelected && (
            <>
              <PrimaryButton
                onClick={handleWrapCro}
                isLoading={isWrapping}
                isDisabled={isWrapping}
                loadingText='Wrapping'
              >
                Wrap and Add
              </PrimaryButton>
            </>
          )}
          {!isWrapping && (
            <PrimaryButton onClick={handleAddCurrency}>
              Add
            </PrimaryButton>
          )}
        </Stack>
      </Stack>

      {isWrappedNativeSelected && (
        <Box fontSize='sm' mt={2}>If wanting to use native {namedTokens.native.symbol} for the deal, you can choose to wrap to {namedTokens.wrappedNative.symbol}</Box>
      )}
    </TitledCard>
  )
}
