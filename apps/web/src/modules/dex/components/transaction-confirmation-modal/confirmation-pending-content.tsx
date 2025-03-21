import styled from "styled-components";
import {Box, Center, Flex, Image, Spinner, Text, VStack} from "@chakra-ui/react";

const ConfirmedIcon = styled(Center)`
  padding: 24px 0;
`;

export function ConfirmationPendingContent({ pendingText }: { pendingText?: string }) {
  return (
    <Box w='full' pb={4}>
      <ConfirmedIcon>
        <Box w={28}>
          <Image
            width={28}
            src="/img/coin-flip.webp"
            alt="eb-ryoshi-spinner"
          />
        </Box>
        {/*<Spinner boxSize={12} />*/}
      </ConfirmedIcon>
      <VStack spacing="12px" justify="center">
        {pendingText ? (
          <>
            <Text fontSize="20px">Waiting For Confirmation</Text>
            <Flex justify="center">
              <Text fontWeight='bold' fontSize='sm' textAlign="center">
                {pendingText}
              </Text>
            </Flex>
          </>
        ) : null}
        <Text fontSize='sm' color="textSubtle" textAlign="center">
          Confirm this transaction in your wallet
        </Text>
      </VStack>
    </Box>
  );
}
