import {BoxProps, ModalProps} from "@chakra-ui/react";
import {ResponsiveDialogComponents, useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React, {useState} from "react";
import {DexToken} from "@dex/types";
import SelectToken from "@dex/components/swap/select-token";

type ResponsiveChooseTokenDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  commonBases: DexToken[];
  tokens: DexToken[];
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
  onSelectToken: (token: DexToken) => void;
}

export function ResponsiveChooseTokenDialog({ isOpen, onClose, commonBases, tokens, modalProps, onSelectToken, ...props }: ResponsiveChooseTokenDialogProps & BoxProps) {
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
        onSelectToken={onSelectToken}
        {...props}
      />
    </DialogComponent>
  );
}

enum Pages {
  SELECT,
  MANAGE
}

function DialogContent({isOpen, onClose, commonBases, tokens, DialogBody, DialogFooter, onSelectToken}: ResponsiveDialogComponents & ResponsiveChooseTokenDialogProps) {

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
            onSelect={onSelectToken}
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