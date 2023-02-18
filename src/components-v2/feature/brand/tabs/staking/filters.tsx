import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex, Heading,
  Radio,
  RadioGroup, VStack
} from "@chakra-ui/react";
import React, {useState} from "react";
import {StakingStatusFilters} from "@src/components-v2/feature/brand/tabs/staking/types";

type FiltersProps = {
  collections: any;
  boosterCollections: any;
  initialCollection?: string;
  initialStatus: StakingStatusFilters;
  onChangeCollection: (address: string) => void;
  onChangeStatus: (status: StakingStatusFilters) => void;
}

const Filters = ({collections, boosterCollections, initialCollection, initialStatus, onChangeCollection, onChangeStatus}: FiltersProps) => {
  const [selectedCollection, setSelectedCollection] = useState<any>(initialCollection);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus.toString());

  const handleChangeCollection = (address: string) => {
    setSelectedCollection(address);
    onChangeCollection(address);
  }

  const handleChangeStatus = (status: string) => {
    setSelectedStatus(status);
    onChangeStatus(parseInt(status));
  }

  return (
    <Box>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Staker
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RadioGroup onChange={handleChangeCollection} value={selectedCollection} mb={2}>
              <VStack align='start'>
                <Heading as='h2' size='sm'>Collections</Heading>
                <Flex direction='column'>
                  {collections.filter((c: any) => !!c.address).map((collection: any) => (
                      <Radio key={collection.address} value={collection.address}>{collection.name}</Radio>
                  ))}
                </Flex>
                {boosterCollections && boosterCollections.length > 1 && (
                    <>
                      <Heading as='h2' size='sm'>Boosters</Heading>
                      <Flex direction='column'>
                        {boosterCollections.filter((c: any) => !!c.address).map((collection: any) => (
                            <Radio key={collection.address} value={collection.address}>{collection.name}</Radio>
                        ))}
                      </Flex>
                    </>
                )}
              </VStack>
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Status
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RadioGroup onChange={handleChangeStatus} value={selectedStatus.toString()} mb={2}>
              <Flex direction='column'>
                <Radio value={StakingStatusFilters.ALL.toString()}>All</Radio>
                <Radio value={StakingStatusFilters.STAKED.toString()}>Staked</Radio>
                <Radio value={StakingStatusFilters.UNSTAKED.toString()}>Unstaked</Radio>
              </Flex>
            </RadioGroup>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default Filters;