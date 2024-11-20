import { Box } from '@chakra-ui/react';
import TokenTable from '../components/tables/tokens-table';
import { useTokenDatas } from '../hooks';
import { Heading } from '@chakra-ui/react';

export default function Tokens() {
  const { tokenDatas, isLoading } = useTokenDatas();
  return (
    <>
      <Heading mt={8} mb={4} fontSize={30}>All Tokens</Heading>
      <TokenTable tokenDatas={tokenDatas} loading={isLoading}/>
    </>
  );
}
