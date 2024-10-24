import styled from 'styled-components';
import { Button, ButtonProps } from '@chakra-ui/react';
import { ElementType, ReactNode } from 'react';

interface ButtonMenuItemProps {
  children: ReactNode;
  isActive?: boolean;
  variant?: string;
  as?: 'a' | 'button' | ElementType;
  to: string
}

interface InactiveButtonProps{
  forwardedAs: ButtonMenuItemProps['as'];
}

const InactiveButton = styled(Button)<InactiveButtonProps>`
  &:hover:not(:disabled):not(:active) {
  }
`;

const ButtonMenuItem = ({ children, isActive = false, variant = 'tab', as, ...props }: ButtonMenuItemProps) => {
  if (!isActive) {
    return (
      <InactiveButton forwardedAs={as} {...props}>
        {children}
      </InactiveButton>
    );
  }

  return (
    <Button as={as} variant={variant} {...props}>
      {children}
    </Button>
  );
};

export default ButtonMenuItem;
