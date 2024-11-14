import { Box } from '@chakra-ui/react';
import PairTable from '../components/tables/pairs-table';
import { usePairDatas } from '../hooks';
import { Heading } from '@chakra-ui/react';
export default function Pairs() {
  const { pairDatas } = usePairDatas();
  return (
    <>
      <Heading mt={8} mb={4} fontSize={30}>Pairs</Heading>
      <PairTable pairDatas={pairDatas} />
    </>
  );
}
