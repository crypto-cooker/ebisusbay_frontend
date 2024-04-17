import {Card} from "@src/components-v2/foundation/card";
import {Box, Button, Flex, HStack, Image, Input, useDisclosure} from "@chakra-ui/react";
import ReactSelect, {SingleValue} from "react-select";
import {DexToken} from "@dex/types";
import {getTheme} from "@src/global/theme/theme";
import {useUser} from "@src/components-v2/useUser";
import {useState} from "react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import {ResponsiveChooseTokenDialog} from "@dex/components/swap/choose-token";
import useSupportedTokens from "@dex/hooks/use-supported-tokens";

interface InputBoxProps {
  availableTokens: DexToken[];
}

export default function InputBox({availableTokens}: InputBoxProps) {
  const user = useUser();
  const {supportedTokens, commonBases} = useSupportedTokens();
  const [selectedToken, setSelectedToken] = useState(availableTokens[0]);

  const {isOpen, onOpen, onClose} = useDisclosure();

  async function handleCurrencyChange(token: SingleValue<DexToken>) {
    if (!token) return;
    setSelectedToken(token);
  }


  return (
    <>
      <Card>
        <Flex justify='space-between' fontSize='sm'>
          <Box>From</Box>
          <Box>Balance: 0.00</Box>
        </Flex>
        <HStack>
          <Input
            placeholder='0.0'
            variant='unstyled'
            fontSize='2xl'
          />
          <Button onClick={onOpen}>
            <HStack>
              <Box as='span' minW='30px'>
                <Image w='30px' src={selectedToken.logoURI} />
              </Box>
              <span>{selectedToken.symbol}</span>
              <ChevronDownIcon />
            </HStack>
          </Button>
        </HStack>
      </Card>
      <ResponsiveChooseTokenDialog
        isOpen={isOpen}
        onClose={onClose}
        commonBases={commonBases}
        tokens={supportedTokens}
      />
    </>
  )
}