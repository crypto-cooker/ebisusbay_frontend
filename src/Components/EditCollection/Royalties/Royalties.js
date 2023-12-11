import React, {useEffect, useState} from 'react';

import {Box, Heading, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import MarketRoyaltyForm from "@src/Components/EditCollection/Royalties/MarketRoyaltyForm";
import {useContractService} from "@src/components-v2/useUser";

const Royalties = ({ address }) => {
  const contractService = useContractService();

  const [isRoyaltyStandard, setIsRoyaltyStandard] = useState(false);

  useEffect(() => {
    async function init() {
      const royalty = await contractService.market.isRoyaltyStandard(address)
      setIsRoyaltyStandard(royalty);
    }
    init();
  }, []);

  return (
    <Box>
      <Heading as="h2" size="lg">Update Royalties</Heading>
      <Box mb={3}>
        {isRoyaltyStandard ? (
          <>
            <Text>This contract has implemented the <b>EIP-2981 (NFT Royalty Standard)</b> interface, which is being used for the market royalties.</Text>
            <Text>These values can only be changed directly on the contract itself.</Text>
          </>
        ) : (
          <MarketRoyaltyForm address={address} />
        )}
      </Box>
    </Box>
  )
}

export default Royalties;