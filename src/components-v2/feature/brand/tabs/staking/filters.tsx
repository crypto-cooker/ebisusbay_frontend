import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Radio,
  RadioGroup
} from "@chakra-ui/react";
import React, {useState} from "react";
import {StakingStatusFilters} from "@src/components-v2/feature/brand/tabs/staking/types";

type FiltersProps = {
  collections: any;
  initialCollection?: string;
  initialStatus: StakingStatusFilters;
  onChangeCollection: (address: string) => void;
  onChangeStatus: (status: StakingStatusFilters) => void;
}

const Filters = ({collections, initialCollection, initialStatus, onChangeCollection, onChangeStatus}: FiltersProps) => {
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
                Collections
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <RadioGroup onChange={handleChangeCollection} value={selectedCollection} mb={2}>
              <Flex direction='column'>
                {collections.filter((c: any) => !!c.address).map((collection: any, index: number) => (
                  <Radio key={collection.address} value={collection.address}>{collection.name}</Radio>
                ))}
              </Flex>
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