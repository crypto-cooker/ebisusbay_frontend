import {
  Box,
  BoxProps,
  Button,
  CloseButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Wrap
} from "@chakra-ui/react";
import React, {ChangeEvent, ComponentType, ReactNode, useEffect, useRef, useState} from "react";
import {useWindowSize} from "@market/hooks/useWindowSize";
import {DexToken} from "@dex/types/types";
import Row from "@dex/components/swap/select-token/row";
import {Currency} from "@uniswap/sdk-core";
import {useAllTokenBalances} from "@dex/hooks/use-token-balances";

interface SelectTokenProps {
  commonBases: Currency[];
  tokens: Currency[];
  onCurrencySelect: (currency: Currency) => void;
}

export default function SelectToken({commonBases, tokens, onCurrencySelect}: SelectTokenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  const windowSize = useWindowSize();
  const [searchTerms, setSearchTerms] = useState('');
  // const tokenBalances = useAtomValue(userTokenBalancesAtom);
  const tokenBalances = useAllTokenBalances();

  console.log('===token balances2', Object.values(tokenBalances).map(token => ({name:token?.currency.symbol, value:token?.toExact()})));
  const checkForScrollbar = () => {
    if (ref.current) {
      const hasScrollbar = ref.current.scrollHeight > ref.current.clientHeight;
      setHasVerticalScrollbar(hasScrollbar);
    }
  };

  const handleSetSearchTerms = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  }

  const handleClearSearch = () => {
    setSearchTerms('');
  };

  useEffect(() => {
    checkForScrollbar();
  }, [windowSize, searchTerms]);

  const filteredTokens = searchTerms ? Object.values(tokenBalances).filter((token) => {
    if (!token?.currency) return false;

    const foundName = token?.currency.name?.toLowerCase().includes(searchTerms.toLowerCase()) ?? false;
    const foundSymbol = token?.currency.symbol?.toLowerCase().includes(searchTerms) ?? false;
    const foundAddress = token?.currency.address?.toLowerCase().includes(searchTerms) ?? false;
    return foundName || foundSymbol || foundAddress;
  }) : tokenBalances;

  return (
    <>
      <Box>
        <VStack p={4} align='start' w='full'>
          <InputGroup>
            <Input
              placeholder='Search by name, address, or symbol'
              value={searchTerms}
              onChange={handleSetSearchTerms}
            />
            {searchTerms?.length && (
              <InputRightElement
                children={<CloseButton onClick={handleClearSearch} />}
              />
            )}
          </InputGroup>
          <Box mt={2}>
            <Box fontSize='sm' fontWeight='bold'>Common bases</Box>
            <Wrap mt={2}>
              {commonBases.map((token) => (
                <Box key={token.symbol}>
                  <Button
                    variant='outline'
                    leftIcon={<Image src={(token as any)?.logoURI} w='30px' />}
                    onClick={() => onCurrencySelect(token)}
                  >
                    {token.symbol}
                  </Button>
                </Box>
              ))}
            </Wrap>
          </Box>
        </VStack>
        <VStack
          ref={ref}
          align='stretch'
          mt={4}
          maxH='450px'
          overflowY='auto'
          spacing={0}
        >
          {(filteredTokens as any)?.map((token: any) => (
            <Row
              key={token.currency.address}
              token={token}
              hasVerticalScrollbar={hasVerticalScrollbar}
              onSelect={() => onCurrencySelect(token.currency)}
            />
          ))}
        </VStack>
      </Box>
    </>
  )
}