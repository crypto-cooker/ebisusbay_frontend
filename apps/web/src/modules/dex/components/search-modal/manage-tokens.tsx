import { useRef, RefObject, useCallback, useState, useMemo } from 'react'
import { Token } from '@pancakeswap/sdk'
import { CurrencyModalView } from './types'
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import styled from "styled-components";
import {safeGetAddress} from "@eb-pancakeswap-web/utils";
import {CurrencyLogo} from "@dex/components/logo";
import {Box, Button, Flex, HStack, Icon, IconButton, Input, Link, Text, VStack} from "@chakra-ui/react";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getBlockExplorerLink} from "@dex/utils";
import ImportRow from "@dex/components/search-modal/import-row";
import useUserAddedTokens from "@eb-pancakeswap-web/state/user/hooks/useUserAddedTokens";
import {useRemoveUserAddedToken} from "@eb-pancakeswap-web/state/user/hooks";
import { useToken } from '@eb-pancakeswap-web/hooks/tokens'

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function ManageTokens({
  setModalView,
  setImportToken,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveChainId()

  const [searchQuery, setSearchQuery] = useState<string>('')

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = safeGetAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const searchToken = useToken(searchQuery)

  // all tokens for local list
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.forEach((token) => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map((token) => (
        <Flex justify='space-between' key={token.address} width="100%">
          <HStack>
            <CurrencyLogo currency={token} size="20px" />
            <Link
              isExternal
              href={getBlockExplorerLink(token.address, 'address', chainId)}
              color="textSubtle"
              ml="10px"
              mr="3px"
            >
              {token.symbol}
            </Link>
          </HStack>
          <HStack>
            <IconButton
              aria-label='Delete'
              variant="text" onClick={() => removeToken(chainId, token.address)}
              icon={<Icon as={FontAwesomeIcon} icon={faTrash} color="textSubtle" />}
            />
          </HStack>
        </Flex>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  const isAddressValid = searchQuery === '' || safeGetAddress(searchQuery)

  return (
    <Wrapper>
      <VStack style={{ width: '100%', flex: '1 1' }} align='stretch'>
        <VStack gap="14px" align='stretch'>
          <Box>
            <Input
              id="token-search-input"
              scale="lg"
              placeholder="0x0000"
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              isWarning={!isAddressValid}
            />
          </Box>
          {!isAddressValid && <Text color="failure">Enter valid token address</Text>}
          {searchToken && (
            <ImportRow
              token={searchToken}
              showImportView={() => setModalView(CurrencyModalView.importToken)}
              setImportToken={setImportToken}
              style={{ height: 'fit-content' }}
            />
          )}
        </VStack>
        {tokenList}
        <Footer>
          <Text fontWeight='bold' color="textSubtle">
            {userAddedTokens?.length} {userAddedTokens.length === 1 ? 'Imported Token' : 'Imported Tokens'}
          </Text>
          {userAddedTokens.length > 0 && (
            <Button variant="tertiary" onClick={handleRemoveAll}>
              Clear all
            </Button>
          )}
        </Footer>
      </VStack>
    </Wrapper>
  )
}
