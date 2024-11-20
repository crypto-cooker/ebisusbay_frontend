import { Button, ButtonProps, useColorModeValue } from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button variant="primary" fontSize={props.fontSize ?? props.size ?? 'sm'} {...props}>
      {props.children}
    </Button>
  );
};

export const SecondaryButton = (props: ButtonProps) => {
  const borderColor = useColorModeValue('gray.300', 'white');

  return (
    <Button variant="outline" fontSize={props.fontSize ?? props.size ?? 'sm'} borderColor={borderColor} {...props}>
      {props.children}
    </Button>
  );
};

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: any;
  replace?: boolean;
  innerRef?: React.Ref<HTMLAnchorElement>;
  // next
  prefetch?: boolean;
}

const A = styled('a').withConfig({
  shouldForwardProp: (props) => !['hideSubNav', 'supportChainIds'].includes(props),
})``;

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(
  ({ to, replace, children, prefetch, ...props }, ref) => (
    // Add legacyBehavior to avoid hydration error
    <NextLink legacyBehavior href={to as string} replace={replace} passHref prefetch={prefetch}>
      <A ref={ref} {...props}>
        {children}
      </A>
    </NextLink>
  ),
);

interface CopyButtonProps{
  value: string;
  props?: any
}

export function CopyButton(props:CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const {value, ...prop} = props

  const copyContent = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return !copied ? (
    <FontAwesomeIcon
      icon={faCopy}
      onClick={() => {
        copyContent(value);
      }}
    />
  ) : (
    <FontAwesomeIcon icon={faCheck} />
  );
}
