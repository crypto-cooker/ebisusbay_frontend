import Tokens from '../tokens';
import Pairs from '../pairs';
import styled from 'styled-components';
import { useProtocolDataQuery } from '../hooks/useProtocolDataQuery';
import { useChartDataVolumeQuery } from '../hooks/useChartDataVolumeQuery';
import HoverableChart from '../components/charts/hoverable-chart';
import { Flex, Heading } from '@chakra-ui/react';
import { Card } from '@src/components-v2/foundation/card';
import LineChart from '../components/charts/line-chart';
import BarChart from '../components/charts/bar-chart'
import TransactionTable from '../components/tables/transaction-table';
import { useTransactionDataQuery } from '../hooks/useTransactionQuery';

export const ChartCardsContainer = styled(Flex)`
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding: 0;
  gap: 1em;

  @media only screen and (max-width : 900px){
    flex-direction: column;
  }

  & > * {
    width: 100%;
  }
`;

export default function Overview() {
  const protocolData = useProtocolDataQuery();
  const chartData = useChartDataVolumeQuery();
  const transactions = useTransactionDataQuery();
  
  const currentDate = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })

  return (
    <>
      <Heading mt={8} mb={4} fontSize={30}>Ebisu's Bay Info & Analytics</Heading>
      <ChartCardsContainer>
        <Card>
          <HoverableChart
            volumeChartData={chartData}
            protocolData={protocolData}
            currentDate={currentDate}
            valueProperty="liquidityUSD"
            title={'Liquidity'}
            ChartComponent={LineChart}
          />
        </Card>
        <Card>
          <HoverableChart
            volumeChartData={chartData}
            protocolData={protocolData}
            currentDate={currentDate}
            valueProperty="volumeUSD"
            title={'Volume 24'}
            ChartComponent={BarChart}
          />
        </Card>
      </ChartCardsContainer>
      <Tokens />
      <Pairs />
      <Heading mt={8} mb={4} fontSize={30}>Transactions</Heading>
      <TransactionTable transactions={transactions}/>
    </>
  );
}
