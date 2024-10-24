import { Box } from '@chakra-ui/react';
import PairTable from '../components/Tables/pairs-table';
import { usePairDatas } from '../hooks/usePairDatas';

export default function Pairs() {
  const { pairDatas } = usePairDatas();
  return (
    <>
      <PairTable pairDatas={pairDatas} />
    </>
  );
}
