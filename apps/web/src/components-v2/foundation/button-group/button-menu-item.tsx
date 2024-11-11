import styled from 'styled-components';
import { Button, ButtonProps, theme } from '@chakra-ui/react';
import { ElementType, ReactNode } from 'react';
import { useUserTheme } from '@src/components-v2/useUser';

interface ButtonMenuItemProps {
  children: ReactNode;
  isActive?: boolean;
  variant?: string;
  as?: 'a' | 'button' | ElementType;
  to?: string;
  onClick?: () => void;
}

interface InactiveButtonProps {
  forwardedAs: ButtonMenuItemProps['as'];
}

const InactiveButton = styled(Button)<InactiveButtonProps>`
  &:hover {
    color: ${({ theme }) => theme.colors.textColor2};
  }
`;

const ButtonMenuItem = ({ children, isActive = false, variant = 'tab', as, ...props }: ButtonMenuItemProps) => {
  const theme = useUserTheme();
  if (!isActive) {
    return (
      <InactiveButton forwardedAs={as} {...props}>
        {children}
      </InactiveButton>
    );
  }

  return (
    <Button as={as} variant={variant} {...props} _hover={{ color: theme.colors.textColor2 }}>
      {children}
    </Button>
  );
};

export default ButtonMenuItem;
