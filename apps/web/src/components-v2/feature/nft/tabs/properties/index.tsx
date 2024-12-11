import Trait from "@src/components-v2/feature/nft/tabs/properties/trait";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {Box, SimpleGrid} from "@chakra-ui/react";
import {isEvoSkullCollection, isLazyHorseCollection, isLazyHorsePonyCollection, isVaultCollection} from "@market/helpers/utils";
import { useChainByIdOrSlug } from '@src/config/hooks';

interface PropertiesProps {
  address: string;
  slug?: string;
  chainSlug: string;
  attributes: any;
  queryKey?: string;
}

const Properties = ({ address, slug, chainSlug, attributes, queryKey }: PropertiesProps) => {
  const chain = useChainByIdOrSlug(chainSlug);

  const { data: collectionTraits } = useQuery({
    queryKey: ['CollectionTraits', address],
    queryFn: () => ApiService.withoutKey().getCollectionTraits(address, chain.id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2
  });

  return (
    <SimpleGrid columns={{base: 1, sm: 2, lg: 3}} gap={3}>
      {attributes.filter((a: any) => a.value !== 'None').map((data: any, i: number) => {
        let occurrence = data.occurrence;
        if (collectionTraits && !!collectionTraits[data.trait_type]?.[data.value]) {
          occurrence = collectionTraits[data.trait_type][data.value].occurrence;
        }

        return (
          <Box key={`property-${i}`} h='full'>
            {queryKey === 'powertraits' && (isEvoSkullCollection(address) || isVaultCollection(address)) ? (
              <Trait
                key={i}
                title={data.key}
                value={data.value}
                type={data.type}
                collectionAddress={address}
                chainSlug={chainSlug}
              />
            ) : queryKey === 'powertraits' && (isLazyHorseCollection(address) || isLazyHorsePonyCollection(address)) ? (
              <Trait
                key={i}
                title={data.trait_type}
                value={data.value}
                valueDisplay={data.value > 0 ? `+ ${data.value}` : undefined}
                percent={data.percent}
                occurrence={occurrence}
                type={data.display_type}
                collectionAddress={address}
                collectionSlug={slug}
                queryKey={queryKey}
                chainSlug={chainSlug}
              />
            ) : (
              <Trait
                key={i}
                title={data.trait_type}
                value={data.value}
                percent={data.percent}
                occurrence={occurrence}
                type={data.display_type}
                collectionAddress={address}
                collectionSlug={slug}
                queryKey={queryKey}
                chainSlug={chainSlug}
              />
            )}
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export default Properties;