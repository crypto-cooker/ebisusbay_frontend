import { Box, Container, FormControl, FormLabel, Heading, Select, Text, VStack } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';
import useBarterDeal from '@src/components-v2/feature/deal/use-barter-deal';
import { SUPPORTED_CHAIN_CONFIGS } from '@src/config/chains';
import { Card } from '@src/components-v2/foundation/card';
import { useAppConfig } from '@src/config/hooks';

export const Step0ChooseChain = ({address}: {address: string}) => {
  const { setChainId, barterState, clearMakerData, clearTakerData } = useBarterDeal();
  const appConfig = useAppConfig();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newChainId = parseInt(e.target.value);
    setChainId(newChainId);
    if (barterState.chainId !== newChainId) {
      clearMakerData(address);
      clearTakerData(address);
    }
  }

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 0: Choose chain
        </Heading>
        <Text>
           Initiate a deal from any supported chain.
        </Text>
      </Box>

      <Container>
        <Card>
          <VStack align='start'>
            <Box>
              <FormControl>
                <FormLabel>Supported chains</FormLabel>
                <Select
                  defaultValue={barterState.chainId?.toString() ?? appConfig.config.defaultChainId.toString()}
                  onChange={handleChange}
                  maxW='200px'
                >
                  {SUPPORTED_CHAIN_CONFIGS.map((chain, index) => (
                    <option key={index} value={chain.chain.id.toString()}>{chain.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </VStack>
        </Card>
      </Container>
    </>
  )
}