import { useUser } from '@src/components-v2/useUser';
import useBarterDeal from '@src/components-v2/feature/deal/use-barter-deal';
import React, { useCallback, useState } from 'react';
import ReactSelect, { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
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
  Spacer,
  Spinner,
  Stack
} from '@chakra-ui/react';
import { TitledCard } from '@src/components-v2/foundation/card';
import { PrimaryButton } from '@src/components-v2/foundation/button';
import { CustomTokenPicker } from '@src/components-v2/feature/deal/create/custom-token-picker';
import { BarterToken } from '@market/state/jotai/atoms/deal';
import { ciEquals } from '@market/helpers/utils';
import { ethers } from 'ethers';
import { commify } from 'ethers/lib/utils';
import { useReadContract } from 'wagmi';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import { Address, erc20Abi } from 'viem';
import { useDealsTokens } from '@src/global/hooks/use-supported-tokens';
import { CmsToken } from '@src/components-v2/global-data-fetcher';
import { getAppChainConfig } from '@src/config/hooks';

export const ChooseTokensTab = ({ address }: { address: string }) => {
  const { toggleSelectionERC20 } = useBarterDeal();

  const handleAddCustomToken = (token: BarterToken) => {
    toggleSelectionERC20(token);
  };

  return (
    <Container>
      <Stack spacing={4}>
        <WhitelistedTokenPicker balanceCheckAddress={address} />
        <CustomTokenPicker onAdd={handleAddCustomToken} />
      </Stack>
    </Container>
  );
};

const WhitelistedTokenPicker = ({ balanceCheckAddress }: { balanceCheckAddress: string }) => {
  const user = useUser();
  const { toggleSelectionERC20, barterState } = useBarterDeal();
  const chainId = barterState.chainId;
  const [quantity, setQuantity] = useState<string>();
  const { namedTokens } = getAppChainConfig(barterState.chainId);

  const { tokens: dealTokens } = useDealsTokens(chainId);
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

  const { data: tokenBalance, isLoading, error } = useReadContract({
    address: selectedCurrency?.address as Address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    chainId,
    args: [balanceCheckAddress as `0x${string}`],
    query: {
      enabled: !!selectedCurrency
    }
  });
  const availableBalanceEth = Number(ethers.utils.formatUnits(tokenBalance ?? 0, selectedCurrency?.decimals ?? 18))

  const handleCurrencyChange = useCallback(
    (currency: SingleValue<CmsToken>) => {
      if (!currency) return;

      setSelectedCurrency(currency);
    },
    [selectedCurrency],
  );

  const handleAddCurrency = () => {
    if (!selectedCurrency) {
      toast.error('A currency is required');
      return;
    }

    if (!quantity) {
      toast.error('An amount is required');
      return;
    }

    toggleSelectionERC20({
      ...selectedCurrency,
      name: selectedCurrency.name!,
      amount: Number(quantity),
    });
  };

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
      color: getTheme(userTheme).colors.textColor3,
    }),
    control: (base: any, state: any) => ({
      ...base,
      background: getTheme(userTheme).colors.bgColor2,
      color: getTheme(userTheme).colors.textColor3,
      padding: 1,
      minWidth: '132px',
      borderColor: 'none',
    }),
  };

  return (
    <TitledCard title="Available Tokens">
      <Stack direction={{ base: 'column', sm: 'row' }}>
        <ReactSelect
          isSearchable={false}
          menuPortalTarget={document.body}
          menuPosition={'fixed'}
          styles={customStyles}
          options={sortedWhitelistedERC20DealCurrencies}
          formatOptionLabel={({ symbol, address, chainId }) => (
            <HStack>
              <Box as="span" minW="30px">
                <CurrencyLogoByAddress address={address} chainId={chainId} />
              </Box>
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
      <Stack direction={{ base: 'column', sm: 'row' }} justify="space-between" mt={2}>
        {!!selectedCurrency ? (
          <HStack fontSize="sm" align="end">
            <Box fontWeight="bold">Balance:</Box>
            <Box>{isLoading ? <Spinner size="sm" /> : commify(availableBalanceEth || 0)}</Box>
          </HStack>
        ) : (
          <Spacer />
        )}
        <PrimaryButton onClick={handleAddCurrency}>Add</PrimaryButton>
      </Stack>
    </TitledCard>
  );
};
