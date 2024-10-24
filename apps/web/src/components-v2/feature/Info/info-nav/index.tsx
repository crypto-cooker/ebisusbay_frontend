import { useState, useMemo } from 'react';
import { Container, Button, HStack, Box, Input, VStack } from '@chakra-ui/react';
import ChainSelector from '../components/chain-selector';
import { useRouter } from 'next/router';
import { PrimaryButton } from '@src/components-v2/foundation/button';
export enum InfoTabIndex {
  Overview,
  Pairs,
  Tokens,
}
import { StandardContainer } from '@src/components-v2/shared/containers';
import { ButtonMenu, ButtonMenuItem } from '@src/components-v2/foundation/button-group';
import { NextLinkFromReactRouter } from '@src/components-v2/foundation/button';
import { useChainPathByQuery } from '../hooks/chain';

export default function InfoNav() {
  const router = useRouter();
  const chainPath = useChainPathByQuery();
  const activeIndex = useMemo(() => {
    if (router.pathname?.includes('/pairs')) {
      return 1;
    }
    if (router?.pathname?.includes('/tokens')) {
      return 2;
    }
    return 0;
  }, []);
  const primaryTabIndex = InfoTabIndex[activeIndex];
  const [tabIndex, setTabIndex] = useState(primaryTabIndex);

  return (
    <Box bgColor="#0d6efd29">
      <StandardContainer>
        <HStack justify="space-between" py={2}>
          <HStack>
            <ButtonMenu activeIndex={activeIndex}>
              <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chainPath}`}>
                Overview
              </ButtonMenuItem>
              <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chainPath}/pairs`}>
                Pairs
              </ButtonMenuItem>
              <ButtonMenuItem as={NextLinkFromReactRouter} to={`/info${chainPath}/tokens`}>
                Tokens
              </ButtonMenuItem>
            </ButtonMenu>
            <ChainSelector activeIndex={activeIndex}/>
          </HStack>
          <HStack>
            <VStack>
              <Input placeholder="Search pair or token" />
            </VStack>
          </HStack>
        </HStack>
      </StandardContainer>
    </Box>
  );
}
