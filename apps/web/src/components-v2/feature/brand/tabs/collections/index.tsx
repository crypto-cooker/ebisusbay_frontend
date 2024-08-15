import {Box, SimpleGrid, Stat, StatLabel, StatNumber, Text, Wrap, WrapItem} from "@chakra-ui/react";
import PreviewCard from "@src/components-v2/shared/preview-card";
import MintingButton from "@src/Components/Collection/MintingButton";
import {round, siPrefixedNumber} from "@market/helpers/utils";
import React from "react";
import {useRouter} from "next/router";

interface CollectionsTabProps {
  collections: any[]
}

const CollectionsTab = ({collections}: CollectionsTabProps) => {
  const router = useRouter();

  const handleMintingButtonClick = (drop: any) => {
    if (drop.redirect) {
      window.open(drop.redirect, '_blank');
    } else {
      router.push(`/drops/${drop.slug}`)
    }
  }

  return (
    <SimpleGrid columns={{base: 1, sm: 2, md: 3, lg: 4}} gap={{base: 4, '2xl': 8}}>
      {collections.filter((c) => !c.hidden).map((collection, index) => (
        <PreviewCard
          key={index}
          index={index + 1}
          banner={collection.metadata.card}
          title={collection.name}
          contextComponent={collection.drop && !collection.drop.complete ?
            <MintingButton onClick={() => handleMintingButtonClick(collection.drop)}/> :
            undefined
          }
          subtitle={
            <Box>
              <Text noOfLines={2} fontSize="xs" px={2}>{collection.metadata.description}</Text>
              <Wrap mt={2} justify="center" spacing={5}>
                <WrapItem>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Items</StatLabel>
                    <StatNumber>{collection.totalSupply ? siPrefixedNumber(collection.totalSupply) : '-'}</StatNumber>
                  </Stat>
                </WrapItem>
                <WrapItem>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Active</StatLabel>
                    <StatNumber>{siPrefixedNumber(collection.stats.total.active)}</StatNumber>
                  </Stat>
                </WrapItem>
                <WrapItem>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Sales</StatLabel>
                    <StatNumber>{siPrefixedNumber(collection.stats.total.complete)}</StatNumber>
                  </Stat>
                </WrapItem>
                <WrapItem>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Volume</StatLabel>
                    <StatNumber>{siPrefixedNumber(round(collection.stats.total.volume))}</StatNumber>
                  </Stat>
                </WrapItem>
              </Wrap>
            </Box>
          }
          url={`/collection/${collection.slug ?? collection.address}`}
          verified={collection.verification?.verified}
        />
      ))}
    </SimpleGrid>
  )
}

export default CollectionsTab;