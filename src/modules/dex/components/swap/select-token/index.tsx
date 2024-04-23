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
import {useAtomValue} from "jotai";
import {userTokenBalancesAtom} from "@dex/state/swap/atom";

interface SelectTokenProps {
  commonBases: DexToken[];
  tokens: DexToken[];
  DialogBody: ComponentType<BoxProps & { children: ReactNode }>;
  DialogFooter: ComponentType<BoxProps & { children: ReactNode }>;
  onSelect: (token: DexToken) => void;
}

export default function SelectToken({commonBases, tokens, DialogBody, DialogFooter, onSelect}: SelectTokenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasVerticalScrollbar, setHasVerticalScrollbar] = useState(false);
  const windowSize = useWindowSize();
  const [searchTerms, setSearchTerms] = useState('');
  const tokenBalances = useAtomValue(userTokenBalancesAtom);

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

  const filteredTokens = searchTerms ? tokenBalances.filter((token) => {
    const foundName = token.name.toLowerCase().includes(searchTerms.toLowerCase());
    const foundSymbol = token.symbol.toLowerCase().includes(searchTerms);
    const foundAddress = token.address.toLowerCase().includes(searchTerms);
    return foundName || foundSymbol || foundAddress;
  }) : tokenBalances;

  return (
    <>
      <DialogBody p={0}>
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
                      leftIcon={<Image src={token.logoURI} w='30px' />}
                      onClick={() => onSelect(token)}
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
            {filteredTokens.map((token) => (
              <Row
                key={token.address}
                token={token}
                hasVerticalScrollbar={hasVerticalScrollbar}
                onSelect={() => onSelect(token)}
              />
            ))}
          </VStack>
        </Box>
      </DialogBody>
      <DialogFooter>
        <Box w='full' textAlign='center'>
          <Button variant='link'>Manage Tokens</Button>
        </Box>
      </DialogFooter>
    </>
  )
}