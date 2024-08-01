import {Box, BoxProps, Button, Flex, IconButton, ModalProps, useBreakpointValue} from "@chakra-ui/react";
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import React, {useCallback, useEffect, useRef, useState} from "react";
import SelectToken from "@dex/swap/components/tabs/swap/select-token";
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import {Currency} from "@pancakeswap/sdk";
import usePreviousValue from "@eb-pancakeswap-web/hooks/usePreviousValue";
import { useAllLists } from '@eb-pancakeswap-web/state/lists/hooks';
import { useListState } from '@eb-pancakeswap-web/state/lists/lists';
import { enableList, removeList, useFetchListCallback } from '@pancakeswap/token-lists/react';
import { CurrencyModalView } from './types'

type CurrencySearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  commonBases: Currency[];
  tokens: Currency[];
  modalProps?: Pick<ModalProps, 'size' | 'isCentered'>;
}

export function CurrencySearchModal({ isOpen, onClose, selectedCurrency, onCurrencySelect, otherSelectedCurrency, commonBases, tokens, modalProps, ...props }: CurrencySearchModalProps & BoxProps) {
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

function DialogContent({isOpen, onClose, commonBases, tokens, onCurrencySelect}: ResponsiveChooseTokenDialogProps) {
  const {
    DialogHeader,
    DialogBody,
    DialogFooter ,
    DialogBasicHeader
  } = useResponsiveDialog();

  const [modalView, setModalView] = useState(CurrencyModalView.search);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onClose();
    },
    [onClose, onCurrencySelect]
  );

  // for token import view
  const prevView = usePreviousValue(modalView)

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  const [, dispatch] = useListState()
  const lists = useAllLists()
  const adding = Boolean(listURL && lists[listURL]?.loadingRequestId)

  const fetchList = useFetchListCallback(dispatch)

  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding || !listURL) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        setModalView(CurrencyModalView.manage)
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL])

  const config = {
    [CurrencyModalView.search]: { title: 'Select a Token', onBack: undefined },
    [CurrencyModalView.manage]: { title: 'Manage', onBack: () => setModalView(CurrencyModalView.search) },
    [CurrencyModalView.importToken]: {
      title: 'Import Tokens',
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: { title: 'Import List', onBack: () => setModalView(CurrencyModalView.search) },
  }

  const isMobile = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!wrapperRef.current) return
    setHeight(wrapperRef.current.offsetHeight - 330)
  }, [])

  return (
    <>
      {modalView === CurrencyModalView.search ? (
        <>
          <DialogBasicHeader title='Select a token' />
          <DialogBody p={0}>
            <SelectToken
              commonBases={commonBases}
              tokens={tokens}
              onCurrencySelect={handleCurrencySelect}
            />
          </DialogBody>
          <DialogFooter>
            <Box w='full' textAlign='center'>
              <Button variant='link' onClick={() => setModalView(CurrencyModalView.manage)}>Manage Tokens</Button>
            </Box>
          </DialogFooter>
        </>
      ) : modalView === CurrencyModalView.manage ? (
        <>
          <DialogHeader>
            <Flex justify='space-between' w='full'>
              <IconButton
                aria-label='back'
                icon={<ArrowBackIcon boxSize={8} />}
                variant='ghost'
                onClick={() => setModalView(CurrencyModalView.search)}
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