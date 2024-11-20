import { useEffect, useMemo, useRef, useState } from 'react';
import useDebounce from '@src/core/hooks/useDebounce';
import { Flex, HStack, Input, Skeleton, Text, Box } from '@chakra-ui/react';
import { MINIMUM_SEARCH_CHARACTERS } from '@src/components-v2/feature/info/state/constants';
import orderBy from 'lodash/orderBy';
import { useRouter } from 'next/router';

import useFetchSearchResults from '../hooks/useFetchSearchResults';
import styled from 'styled-components';
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers';
import { useChainIdByQuery, useChainNameByQuery, useChainPathByQuery } from '../hooks/chain';
import { CurrencyLogoByAddress } from '@dex/components/logo';
import { Card } from '@src/components-v2/foundation/card';
import DecimalAbbreviatedNumber from '@src/components-v2/shared/decimal-abbreviated-number';

const Container = styled(Box)`
  position: relative;
  z-index: 30;
  @media screen and (min-width: 768px) {
    width: 40%;
  }
  width: 100%;
`;

const StyledInput = styled(Input)`
  z-index: 9999;
  border: 1px solid;
  width: 100%;
`;

const Menu = styled(Card)`
  display: flex;
  flex-direction: column;
  z-index: 99;
  position: absolute;
  top: 50px;
  max-height: 400px;
  overflow: auto;
  right: 0;
  border-radius: 8px;
  box-shadow:
    0px 0px 1px rgba(0, 0, 0, 0.04),
    0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.04);
  margin-top: 4px;
  @media screen and (min-width: 768px) {
    width: 200%;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Blackout = styled.div`
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  z-index: 10;
  background-color: black;
  opacity: 0.7;
  left: 0;
  top: 0;
`;

const ResponsiveGrid = styled(Box)`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
  margin: 8px 0;
  align-items: center;
  font-size: 12px;
`;

const Break = styled.div`
  height: 1px;
  width: 100%;
  margin: 16px 0;
`;

const HoverText = styled.div`
  display: block;
  margin-top: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const HoverRowLink = styled.div`
  font-size: 8px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`;

const Search = () => {
  const router = useRouter();
  const chainId = useChainIdByQuery();
  const chainPath = useChainPathByQuery();

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const showMoreTokenRef = useRef<HTMLDivElement>(null);
  const showMorePairRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [value, setValue] = useState('');
  const debouncedSearchTerm = useDebounce(value, 600);

  const { tokens, pairs, tokensLoading, pairsLoading, error } = useFetchSearchResults(debouncedSearchTerm, showMenu);

  const [tokensShown, setTokensShown] = useState(3);
  const [pairsShown, setPairsShown] = useState(3);

  useEffect(() => {
    setTokensShown(3);
    setPairsShown(3);
  }, [debouncedSearchTerm]);

  const handleOutsideClick = (e: any) => {
    const menuClick = menuRef.current && menuRef.current.contains(e.target);
    const inputCLick = inputRef.current && inputRef.current.contains(e.target);
    const showMoreTokenClick = showMoreTokenRef.current && showMoreTokenRef.current.contains(e.target);
    const showMorePairClick = showMorePairRef.current && showMorePairRef.current.contains(e.target);

    if (!menuClick && !inputCLick && !showMoreTokenClick && !showMorePairClick) {
      setPairsShown(3);
      setTokensShown(3);
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const htmlBodyElement = document.querySelector('body');
    if (htmlBodyElement) {
      if (showMenu) {
        document.addEventListener('click', handleOutsideClick);
        htmlBodyElement.style.overflow = 'hidden';
      } else {
        document.removeEventListener('click', handleOutsideClick);
        htmlBodyElement.style.overflow = 'visible';
      }
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
    return undefined;
  }, [showMenu]);

  const handleItemClick = (to: string) => {
    setShowMenu(false);
    setPairsShown(3);
    setTokensShown(3);
    router.push(to);
  };

  // filter on view
  const tokensForList = useMemo(() => {
    return orderBy(tokens, (token) => token.priceUSD, 'desc');
  }, [tokens]);

  const pairForList = useMemo(() => {
    return orderBy(pairs, (pair) => pair?.liquidity, 'desc');
  }, [pairs]);

  const contentUnderTokenList = () => {
    const isLoading = tokensLoading;
    const noTokensFound =
      tokensForList.length === 0 && !isLoading && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS;
    const showMessage = noTokensFound;
    const noTokensMessage = 'No results';
    return (
      <>
        {isLoading && <Skeleton />}
        {showMessage && <Text>{noTokensMessage}</Text>}
        {debouncedSearchTerm.length < MINIMUM_SEARCH_CHARACTERS && <Text>{'Search liquidity pairs or tokens'}</Text>}
      </>
    );
  };

  const contentUnderPairList = () => {
    const isLoading = pairsLoading;
    const noPairsFound =
      pairForList.length === 0 && !pairsLoading && debouncedSearchTerm.length >= MINIMUM_SEARCH_CHARACTERS;
    const showMessage = noPairsFound;
    const noPairsMessage = 'No results';
    return (
      <>
        {isLoading && <Skeleton />}
        {showMessage && <Text>{noPairsMessage}</Text>}
        {debouncedSearchTerm.length < MINIMUM_SEARCH_CHARACTERS && <Text>{'Search liquidity pairs or tokens'}</Text>}
      </>
    );
  };
  return (
    <>
      {showMenu ? <Blackout /> : null}
      <Container mt={{ base: 2, sm: 0 }}>
        <StyledInput
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={'Search liquidity pairs or tokens'}
          ref={inputRef}
          onFocus={() => {
            setShowMenu(true);
          }}
        />
        {showMenu && (
          <Menu>
            <Box ref={menuRef}>
              {error && <Text color="failure">{'Error occurred, please try again'}</Text>}
              <ResponsiveGrid>
                <Text fontWeight="bold" fontSize="12px">
                  {'Tokens'}
                </Text>
                <Text textAlign="end" fontSize="12px">
                  {'Price'}
                </Text>
              </ResponsiveGrid>
              {tokensForList.slice(0, tokensShown).map((token) => {
                return (
                  <HoverRowLink
                    onClick={() => handleItemClick(`/info${chainPath}/tokens/${token.address}`)}
                    key={`searchTokenResult${token.address}`}
                  >
                    <ResponsiveGrid>
                      <Flex>
                        <Box display={{ base: 'none', sm: 'flex' }}>
                          <CurrencyLogoByAddress size="20px" address={token.address} chainId={chainId} />
                        </Box>
                        <Text ml="10px">
                          <Text>{`${token.address && token.name} (${token.address && token.symbol})`}</Text>
                        </Text>
                      </Flex>
                      <Text justifyContent="end" display='flex'>$<DecimalAbbreviatedNumber value={formatAmount(token.priceUSD) ?? 0}/></Text>
                    </ResponsiveGrid>
                  </HoverRowLink>
                );
              })}
              {contentUnderTokenList()}

              <HoverText
                onClick={() => {
                  if (tokensShown + 5 < tokensForList.length) setTokensShown(tokensShown + 5);
                  else setTokensShown(tokensForList.length);
                }}
                ref={showMoreTokenRef}
                style={{ ...(tokensForList.length <= tokensShown && { display: 'none' }) }}
              >
                {'See more...'}
              </HoverText>

              <Break />
              <ResponsiveGrid>
                <Text fontWeight="bold" fontSize="12px" mb="8px">
                  {'Pairs'}
                </Text>
                <Text textAlign="end" fontSize="12px">
                  {'Liquidity'}
                </Text>
              </ResponsiveGrid>
              {pairForList.slice(0, pairsShown).map((p) => {
                return (
                  <HoverRowLink
                    onClick={() => handleItemClick(`/info${chainPath}/pairs/${p?.address}`)}
                    key={`searchPairResult${p?.address}`}
                  >
                    <ResponsiveGrid>
                      <Flex>
                        <HStack display={{ base: 'none', sm: 'flex' }}>
                          <CurrencyLogoByAddress size="20px" address={p.token0.address} chainId={chainId} />
                          <CurrencyLogoByAddress size="20px" address={p.token1.address} chainId={chainId} />
                        </HStack>
                        <Text ml="10px" style={{ whiteSpace: 'nowrap' }}>
                          <Text>{`${p && p.token0.symbol} / ${p && p.token1.symbol}`}</Text>
                        </Text>
                      </Flex>
                      <Text textAlign="end">${formatAmount(p?.liquidity)}</Text>
                    </ResponsiveGrid>
                  </HoverRowLink>
                );
              })}
              {contentUnderPairList()}
              <HoverText
                onClick={() => {
                  if (pairsShown + 5 < pairForList.length) setPairsShown(pairsShown + 5);
                  else setPairsShown(pairForList.length);
                }}
                ref={showMorePairRef}
                style={{ ...(pairForList.length <= pairsShown && { display: 'none' }) }}
              >
                {'See more...'}
              </HoverText>
            </Box>
          </Menu>
        )}
      </Container>
    </>
  );
};

export default Search;
