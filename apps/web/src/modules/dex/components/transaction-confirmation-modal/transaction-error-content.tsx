import { ReactElement } from "react";
import styled from "styled-components";
import {Button, Center, Flex, Text, VStack} from "@chakra-ui/react";
import {WarningIcon} from "@chakra-ui/icons";
import {DEX_COLORS} from "@dex/swap/constants/style";

const Wrapper = styled.div`
  width: 100%;
`;

export function TransactionErrorContent({
  message,
  onDismiss,
}: {
  message: ReactElement | string;
  onDismiss?: () => void;
}) {
  return (
    <Wrapper>
      <VStack justify="center">
        <Center>
          <WarningIcon color={DEX_COLORS.failure} boxSize={8} />
        </Center>
        <Text color="failure" style={{ textAlign: "center", width: "85%", wordBreak: "break-word" }}>
          {message}
        </Text>
      </VStack>

      {onDismiss ? (
        <Flex justify="center" pt="24px">
          <Button onClick={onDismiss}>Dismiss</Button>
        </Flex>
      ) : null}
    </Wrapper>
  );
}
