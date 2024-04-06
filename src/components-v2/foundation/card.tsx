import React, {ReactNode} from 'react';
import {Card as ChakraCard, CardBody, CardProps, Heading} from '@chakra-ui/react'; // Alias Chakra's Card

export const Card = ({ bodyPadding, children, ...props }: CardProps & { bodyPadding?: number | string, children: ReactNode }) => {
  return (
    <ChakraCard
      variant='outline'
      rounded='lg'
      {...props}
    >
      <CardBody padding={bodyPadding ?? undefined}>
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