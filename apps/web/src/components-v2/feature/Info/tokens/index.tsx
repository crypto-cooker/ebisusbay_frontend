import { Box } from '@chakra-ui/react';
import TokenTable from '../components/Tables/tokens-table';
import { useTokenDatas } from '../hooks/useTokenDatas';
import { Heading } from '@chakra-ui/react';

export default function Tokens() {
  const { tokenDatas } = useTokenDatas();
  return (
    <>
      <Heading mt={8}>All Tokens</Heading>
      <TokenTable tokenDatas={tokenDatas} />
    </>
  );
}
