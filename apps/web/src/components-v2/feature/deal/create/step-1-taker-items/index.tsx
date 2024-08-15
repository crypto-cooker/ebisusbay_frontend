import {Box, Heading, Text} from "@chakra-ui/react";
import React from "react";
import {Tab, Tabs} from "@src/components-v2/foundation/tabs";
import {ChooseNftsTab} from "@src/components-v2/feature/deal/create/step-1-taker-items/choose-nfts";
import {ChooseTokensTab} from "@src/components-v2/feature/deal/create/step-1-taker-items/choose-tokens";

interface Step1ChooseItemsProps {
  address: string;
}

export const Step1ChooseItems = ({address}: Step1ChooseItemsProps) => {

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 1: Select their items
        </Heading>
        <Text>
          Choose NFTs, Tokens, or both!
        </Text>
      </Box>
      <Tabs tabListStyle={{textAlign: 'start'}}>
        <Tab label='NFTs'>
          <ChooseNftsTab address={address} />
        </Tab>
        <Tab label='Tokens'>
          <ChooseTokensTab address={address} />
        </Tab>
      </Tabs>
    </>
  )
}





