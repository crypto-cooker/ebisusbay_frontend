import {Box, Heading, Text} from "@chakra-ui/react";
import React from "react";
import {Tab, Tabs} from "@src/components-v2/foundation/tabs";
import {ChooseNftsTab} from "@src/components-v2/feature/deal/create/step-2-maker-items/choose-nfts";
import {ChooseTokensTab} from "@src/components-v2/feature/deal/create/step-2-maker-items/choose-tokens";

interface Step2ChooseItemsProps {
  address: string;
}

export const Step2ChooseItems = ({address}: Step2ChooseItemsProps) => {

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 2: Select your items
        </Heading>
        <Text>
          Offer up any NFTs, Tokens, or both!
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


