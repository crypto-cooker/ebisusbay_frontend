import {Box, BoxProps, Button, Flex, IconButton, ModalProps} from "@chakra-ui/react";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React, {useState} from "react";
import {DexToken} from "@dex/types/types";
import SelectToken from "@dex/components/swap/select-token";
import {Currency} from "@uniswap/sdk-core";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";

type ResponsiveChooseTokenDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  commonBases: DexToken[];
  tokens: DexToken[];
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
}

export function ResponsiveChooseTokenDialog({ isOpen, onClose, selectedCurrency, onCurrencySelect, otherSelectedCurrency, commonBases, tokens, modalProps, ...props }: ResponsiveChooseTokenDialogProps & BoxProps) {
  const ResponsiveDialog = useResponsiveDialog();

  return (
    <ResponsiveDialog.DialogComponent isOpen={isOpen} onClose={onClose} modalProps={modalProps} {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        commonBases={commonBases}
        tokens={tokens}
        onCurrencySelect={onCurrencySelect}
        {...props}
      />
    </ResponsiveDialog.DialogComponent>
  );
}

enum Pages {
  SELECT,
  MANAGE
}

function DialogContent({isOpen, onClose, commonBases, tokens, onCurrencySelect}: ResponsiveChooseTokenDialogProps) {
  const {
    DialogHeader,
    DialogBody,
    DialogFooter ,
    DialogCloseButton
  } = useResponsiveDialog();

  const [page, setPage] = useState(Pages.SELECT);

  return (
    <>
      {page === Pages.SELECT ? (
        <>
          <DialogHeader>
            Select a token
          </DialogHeader>
          <DialogCloseButton />
          <DialogBody p={0}>
            <SelectToken
              commonBases={commonBases}
              tokens={tokens}
              onCurrencySelect={onCurrencySelect}
            />
          </DialogBody>
          <DialogFooter>
            <Box w='full' textAlign='center'>
              <Button variant='link' onClick={() => setPage(Pages.MANAGE)}>Manage Tokens</Button>
            </Box>
          </DialogFooter>
        </>
      ) : page === Pages.MANAGE ? (
        <>
          <DialogHeader>
            <Flex justify='space-between' w='full'>
              <IconButton
                aria-label='back'
                icon={<ArrowBackIcon boxSize={8} />}
                variant='ghost'
                onClick={() => setPage(Pages.SELECT)}
              />
              <Box>Manage</Box>
              <IconButton
                aria-label='close'
                icon={<CloseIcon />}
                variant='ghost'
                onClick={onClose}
              />
            </Flex>
          </DialogHeader>
          <DialogBody>
            Manage content here
          </DialogBody>
        </>
      ) : (
        <>WAT</>
      )}
    </>
  )
}