import React, { ReactNode } from 'react';
import {Card as ChakraCard, CardProps, CardBody, CardHeader, Heading} from '@chakra-ui/react'; // Alias Chakra's Card

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

export const TitledCard = ({ title, children, ...props }: { title: string, children: ReactNode } & CardProps) => {
  return (
    <ChakraCard
      variant='outline'
      rounded='lg'
      {...props}
    >
      <CardBody>
        <Heading size='md' mb={2}>{title}</Heading>
        {children}
      </CardBody>
    </ChakraCard>
  );
}