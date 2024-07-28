import {ReactNode} from "react";
import {Box, Flex, HStack, Icon, IconButton, SimpleGrid, Text} from "@chakra-ui/react";
import {useIsMounted} from "@eb-pancakeswap-web/hooks/useIsMounted";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons";

type SwapInfoType = {
  price: ReactNode;
  allowedSlippage?: number;
  onSlippageClick?: () => void;
  allowedSlippageSlot?: React.ReactNode;
};

export const SwapInfo = ({ allowedSlippage, price, onSlippageClick, allowedSlippageSlot }: SwapInfoType) => {
  const isMounted = useIsMounted();

  return (
    <SimpleGrid gap={0}>
      <Box>{price}</Box>
      {typeof allowedSlippage === "number" && (
        <Flex align='center' justify='space-between' fontSize='sm' fontWeight='bold'>
          <HStack align='center'>
            <Text>Slippage Tolerance</Text>
            {onSlippageClick ? (
              <IconButton
                variant='unstyled'
                onClick={onSlippageClick}
                aria-label="Swap slippage button"
                icon={<Icon as={FontAwesomeIcon} icon={faPencil} boxSize={3} />}
              />
            ) : null}
          </HStack>
          {isMounted &&
            (allowedSlippageSlot ?? (
              <Text fontWeight='bold' color="primary">
                {allowedSlippage / 100}%
              </Text>
            ))}
        </Flex>
      )}
    </SimpleGrid>
  );
};
