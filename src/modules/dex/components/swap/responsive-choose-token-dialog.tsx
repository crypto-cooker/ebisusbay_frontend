import {BoxProps, ModalProps} from "@chakra-ui/react";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React, {useState} from "react";
import {DexToken} from "@dex/types/types";
import SelectToken from "@dex/components/swap/select-token";
import {Currency} from "@uniswap/sdk-core";

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
  const { DialogComponent, DialogBody, DialogFooter } = useResponsiveDialog();

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title='Select a token' modalProps={modalProps} {...props}>
      <DialogContent
        isOpen={isOpen}
        onClose={onClose}
        commonBases={commonBases}
        tokens={tokens}
        DialogBody={DialogBody}
        DialogFooter={DialogFooter}
        onCurrencySelect={onCurrencySelect}
        {...props}
      />
    </DialogComponent>
  );
}

enum Pages {
  SELECT,
  MANAGE
}

function DialogContent({isOpen, onClose, commonBases, tokens, DialogBody, DialogFooter, onCurrencySelect}: ResponsiveDialogComponents & ResponsiveChooseTokenDialogProps) {

  const [page, setPage] = useState(Pages.SELECT);

  return (
    <>
      {page === Pages.SELECT ? (
        <>
          <SelectToken
            commonBases={commonBases}
            tokens={tokens}
            DialogBody={DialogBody}
            DialogFooter={DialogFooter}
            onCurrencySelect={onCurrencySelect}
          />
        </>
      ) : page === Pages.MANAGE ? (
        <>TBA</>
      ) : (
        <>WAT</>
      )}
    </>
  )
}