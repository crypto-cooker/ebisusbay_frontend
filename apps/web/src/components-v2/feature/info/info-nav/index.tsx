import { useMemo } from 'react';
import { HStack, Box } from '@chakra-ui/react';
import ChainSelector from '../components/chain-selector';
import { useRouter } from 'next/router';
export enum InfoTabIndex {
  Overview,
  Pairs,
  Tokens,
}
import { StandardContainer } from '@src/components-v2/shared/containers';
import { ButtonMenu, ButtonMenuItem } from '@src/components-v2/foundation/button-group';
import Link from 'next/link';
import { useChainPathByQuery } from '../hooks/chain';
import Search from '../components/search';

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

  return (
    <Box bgColor="#0d6efd29" mb={4}>
      <StandardContainer>
        <Box display={{ base: 'block', sm: 'flex' }} flexWrap={'wrap'} gap={2} justifyContent="space-between" py={2}>
          <HStack>
            <ButtonMenu activeIndex={activeIndex}>
              <ButtonMenuItem as={Link} href={`/info${chainPath}`}>
                Overview
              </ButtonMenuItem>
              <ButtonMenuItem as={Link} href={`/info${chainPath}/pairs`}>
                Pairs
              </ButtonMenuItem>
              <ButtonMenuItem as={Link} href={`/info${chainPath}/tokens`}>
                Tokens
              </ButtonMenuItem>
            </ButtonMenu>
            <ChainSelector activeIndex={activeIndex} />
          </HStack>
          <Search/>
        </Box>
      </StandardContainer>
    </Box>
  );
}
