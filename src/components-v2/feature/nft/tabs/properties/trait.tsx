import {humanize, mapAttributeString, millisecondTimestamp, relativePrecision} from "@src/utils";
import Link from "next/link";
import React from "react";
import {Box, Heading} from "@chakra-ui/react";

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
}: TraitProps) => {
  const Value = () => {
    return (
      <Heading as='h4'>
        {value !== undefined ? (
          <>
            {type === 'date' ? (
              <>{new Date(millisecondTimestamp(value)).toDateString()}</>
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
        <Heading as='h5'>{humanize(title)}</Heading>
        {(collectionSlug || collectionAddress) && queryKey && value ? (
          <Link
            href={{
              pathname: `/collection/${collectionSlug ?? collectionAddress}`,
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