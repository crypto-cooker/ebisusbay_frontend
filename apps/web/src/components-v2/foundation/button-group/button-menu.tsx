import React, { cloneElement, Children, ReactElement } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Box, HStack } from '@chakra-ui/react';
import { PrimaryButton } from '../button';

interface ButtonMenuProps {
  children: ReactElement[];
  activeIndex: number;
}

const buttonProps = [
  { roundedLeft: 'full', roundedRight: 0, fontSize: 'sm' },
  { rounded: 0, fontSize: 'sm' },
  { roundedLeft: 0, roundedRight: 'full', fontSize: 'sm' },
];


const ButtonMenu = ({ children, activeIndex = 0 }: ButtonMenuProps) => {
  const buttonLength = Children.count(children);
  return (
    <HStack gap={'1px'}>
      {Children.map(children, (child: ReactElement, index) => {
        const propsIndex = index != 0 && index != buttonLength - 1 ? 1 : index;
        const variant = activeIndex === index ? 'primary' : 'ryoshiDynasties';
        return cloneElement(child, {
          isActive: activeIndex === index,
          ...buttonProps[propsIndex],
          variant,
        });
      })}
    </HStack>
  );
};

export default ButtonMenu;
