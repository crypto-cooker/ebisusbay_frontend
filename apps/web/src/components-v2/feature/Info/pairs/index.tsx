import { Box } from '@chakra-ui/react';
import PairTable from '../components/Tables/pairs-table';
import { usePairDatas } from '../hooks/usePairDatas';
import { Heading } from '@chakra-ui/react';
export default function Pairs() {
  const { pairDatas } = usePairDatas();
  return (
    <>
      <Heading mt={8}>Pairs</Heading>
      <PairTable pairDatas={pairDatas} />
    </>
  );
}
