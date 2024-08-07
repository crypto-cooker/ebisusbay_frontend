import {Box, Button, ButtonProps} from "@chakra-ui/react";
import {useIsMounted} from "@eb-pancakeswap-web/hooks/useIsMounted";
import {useAccount} from "wagmi";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {useUser} from "@src/components-v2/useUser";

const wrongNetworkProps: ButtonProps = {
  colorScheme: 'red',
  isDisabled: false,
  children: <Box>Wrong Network</Box>,
}

export const CommitButton = (props: ButtonProps) => {
  const { isWrongNetwork } = useActiveChainId()
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { connect } = useUser();

  if (!isConnected && isMounted) {
    return (
      <PrimaryButton
        size='lg'
        onClick={connect}
        w='full'
      >
        Connect Wallet
      </PrimaryButton>
    )
  }

  return (
    <Button
      size='lg'
      {...props}
      onClick={(e) => {
        if (!isWrongNetwork) {
          props.onClick?.(e)
        }
      }}
      {...(isWrongNetwork && wrongNetworkProps)}
    />
  )
}
