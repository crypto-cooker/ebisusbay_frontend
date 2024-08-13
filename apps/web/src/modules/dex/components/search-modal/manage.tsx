import React, { useState } from 'react'
import { Token } from '@pancakeswap/sdk'
import { styled } from 'styled-components'
import { TokenList } from '@pancakeswap/token-lists'
import { CurrencyModalView } from './types'
import {useResponsiveDialog} from "@src/components-v2/foundation/responsive-dialog";
import ManageLists from "@dex/components/search-modal/manage-lists";
import ManageTokens from "@dex/components/search-modal/manage-tokens";
import {Tab, Tabs} from "@src/components-v2/foundation/tabs";
// import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/react'


export default function Manage({
  setModalView,
  setImportList,
  setImportToken,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const { DialogBody } = useResponsiveDialog();
  const [showLists, setShowLists] = useState(true)

  return (
    <DialogBody style={{ overflow: 'visible' }}>
      <Tabs>
        <Tab label='Lists'>
          <>asdf</>
          {/*<ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />*/}
        </Tab>
        <Tab label='Tokens'>
          <ManageTokens setModalView={setModalView} setImportToken={setImportToken} />
        </Tab>
      </Tabs>
    </DialogBody>
  )
}
