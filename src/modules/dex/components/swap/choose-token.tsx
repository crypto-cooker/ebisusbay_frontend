import {Box, BoxProps, Button, Flex, HStack, Image, Input, VStack, Wrap} from "@chakra-ui/react";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React from "react";
import {DexToken} from "@dex/types";

type AcceptOfferDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  commonBases: DexToken[];
  tokens: DexToken[];
}

export function ResponsiveChooseTokenDialog({ isOpen, onClose, commonBases, tokens, ...props }: AcceptOfferDialogProps & BoxProps) {
  const { DialogComponent, DialogBody, DialogFooter } = useResponsiveDialog();

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title='Select a token' {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        commonBases={commonBases}
        tokens={tokens}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        {...props}
      />
    </DialogComponent>
  );
}

function DialogContent({isOpen, onClose, commonBases, tokens, DialogBody, DialogFooter}: ResponsiveDialogComponents & AcceptOfferDialogProps) {
  return (
    <>
      <DialogBody>
        <Box p={4}>
          <VStack align='start' w='full'>
            <Input
              placeholder='Search by name, address, or symbol'
            />
            <Box>
              <Box>Common bases</Box>
              <Wrap>
                {commonBases.map((token) => (
                  <Box key={token.symbol}></Box>
                ))}
              </Wrap>
            </Box>
          </VStack>
          <VStack align='stretch' mt={8}>
            {tokens.map((token) => (
              <Flex justify='space-between'>
                <HStack w='full'>
                  <Box>
                    <Image src={token.logoURI} w='30px' />
                  </Box>
                  <VStack align='start' spacing={0}>
                    <Box fontWeight='bold'>{token.symbol}</Box>
                    <Box className='text-muted' fontSize='sm'>{token.name}</Box>
                  </VStack>
                </HStack>
                <Box my='auto'>100</Box>
              </Flex>
            ))}
          </VStack>
        </Box>
      </DialogBody>
      <DialogFooter>
        <Box w='full' textAlign='center'>
          <Button variant='link'>Manage Tokens</Button>
        </Box>
      </DialogFooter>
    </>
  )
}