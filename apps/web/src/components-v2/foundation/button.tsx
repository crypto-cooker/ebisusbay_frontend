import {Button, ButtonProps, useColorModeValue} from "@chakra-ui/react";
import { forwardRef } from "react";
import styled from "styled-components";
import NextLink from "next/link";

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <Button
      variant='primary'
      fontSize={props.fontSize ?? props.size ?? 'sm'}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export const SecondaryButton = (props: ButtonProps) => {
  const borderColor = useColorModeValue('gray.300', 'white');

  return (
    <Button
      variant='outline'
      fontSize={props.fontSize ?? props.size ?? 'sm'}
      borderColor={borderColor}
      {...props}
    >
      {props.children}
    </Button>
  )
}

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: any;
  replace?: boolean;
  innerRef?: React.Ref<HTMLAnchorElement>;
  // next
  prefetch?: boolean;
}

const A = styled("a").withConfig({
  shouldForwardProp: (props) => !["hideSubNav", "supportChainIds"].includes(props),
})``;

/**
 * temporary solution for migrating React Router to Next.js Link
 */
export const NextLinkFromReactRouter = forwardRef<any, LinkProps>(({ to, replace, children, prefetch, ...props }, ref) => (
  // Add legacyBehavior to avoid hydration error
  <NextLink legacyBehavior href={to as string} replace={replace} passHref prefetch={prefetch}>
    <A ref={ref} {...props}>
      {children}
    </A>
  </NextLink>
));

