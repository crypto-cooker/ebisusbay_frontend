import {
  humanizeAdvanced,
  isVaultCollection,
  mapAttributeString,
  millisecondTimestamp,
  relativePrecision, round
} from "@market/helpers/utils";
import Link from "next/link";
import React from "react";
import {Box, Heading} from "@chakra-ui/react";
import { ethers } from "ethers";
import {commify} from "ethers/lib/utils";

interface TraitProps {
  title: string;
  value: any;
  valueDisplay?: string;
  percent?: number;
  occurrence?: number;
  type?: string;
  collectionAddress?: string;
  collectionSlug?: string;
  queryKey?: string;
  chainSlug: string;
}

const Trait = ({
 title,
 value,
 valueDisplay,
 percent,
 occurrence,
 type,
 collectionAddress,
 collectionSlug,
 queryKey,
 chainSlug
}: TraitProps) => {
  const Value = () => {
    return (
      <Heading as='h4'>
        {value !== undefined ? (
          <>
            {type === 'date' ? (
              <>{new Date(millisecondTimestamp(value)).toDateString()}</>
            ) : type === 'seconds' ? (
              <>{parseInt(value) / 86400} Days</>
            ) : type === 'wei' ? (
              <>{commify(round(ethers.utils.formatEther(value)))} FRTN</>
            ) : (
              <>{mapAttributeString(valueDisplay ?? value, collectionAddress, title, true)}</>
            )}
          </>
        ) : (
          <>N/A</>
        )}
      </Heading>
    );
  };

  return (
    <Box h='full'>
      <Box className="nft_attr">
        <Heading as='h5'>{humanizeAdvanced(title)}</Heading>
        {(collectionSlug || collectionAddress) && queryKey && value ? (
          <Link
            href={{
              pathname: `/collection/${chainSlug}/${collectionSlug ?? collectionAddress}`,
              query: { [queryKey]: JSON.stringify({ [title]: [value.toString()] }) },
            }}
          >
            <Value />
          </Link>
        ) : (
          <Value />
        )}
        {occurrence ? (
          <Box as='span'>{relativePrecision(occurrence)}% have this trait</Box>
        ) : (
          percent && <Box as='span'>{percent}% have this trait</Box>
        )}
      </Box>
    </Box>
  );
};

export default Trait;