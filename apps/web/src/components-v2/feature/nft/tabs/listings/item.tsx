import React from 'react';

import Link from 'next/link';

import Blockies from 'react-blockies';
import {Box, Text} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";

interface ListingItemProps {
  user: string;
  route: string;
  time: string;
  price: string;
  primaryTitle: string;
  primaryText: string;
  buttonText?: string;
  onClick?: () => void;
  isProcessing?: boolean;
  amount?: number;
}

const ListingItem = ({
  user,
  route,
  time,
  price,
  primaryTitle,
  primaryText,
  buttonText,
  onClick,
  isProcessing = false,
  amount = 1
}: ListingItemProps) => {
  const link = `${route}/${user}`;

  return (
    <Box className="listing-row">
      <Box className="listing-container">
        <Link className="avatar" href={link}>
          <Box className="blockies me-3">
            <span>
              {/* <Link href={link}> */}
              <Blockies seed={user.toLowerCase()} size={10} scale={5} />
              {/* </Link> */}
            </span>
          </Box>
        </Link>
        <Box>
          <Box>
            {amount && (
              <Text as='span' fontSize='md'>Pack of <strong>{amount}</strong></Text>
            )}
            <Text as='span' fontSize='xs' className='text-muted'>{' '}({time} ago)</Text>
          </Box>
          {`${primaryTitle} `}
          <b>
            <Link href={link}>
              {primaryText}
            </Link>
          </b>{' '}
          for <b>{price} CRO</b>
        </Box>
      </Box>
      {buttonText && (
        <PrimaryButton
          onClick={onClick}
          disabled={isProcessing}
          loadingText={`${buttonText}...`}
        >
          {buttonText}
        </PrimaryButton>
      )}
    </Box>
  );
};

export default ListingItem;
