import React, { ReactNode } from 'react';
import { Card as ChakraCard, CardProps, CardBody } from '@chakra-ui/react'; // Alias Chakra's Card

export const Card = ({ children, ...props }: CardProps & { children: ReactNode }) => {
  return (
    <ChakraCard
      variant='outline'
      rounded='lg'
      {...props}
    >
      <CardBody>
        {children}
      </CardBody>
    </ChakraCard>
  );
};
