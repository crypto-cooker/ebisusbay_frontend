import { ChainId } from '@pancakeswap/chains'
import { Currency, Token } from '@pancakeswap/sdk'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import truncateHash from '@pancakeswap/utils/truncateHash'
import React, { useState } from 'react'
import { useCombinedInactiveList } from '@eb-pancakeswap-web/state/lists/hooks'
import { useAddUserToken } from '@eb-pancakeswap-web/state/user/hooks'
import { useQuery } from '@tanstack/react-query'
import {useActiveChainId} from "@eb-pancakeswap-web/hooks/useActiveChainId";
import {
  Alert,
  AlertIcon,
  Box, Button,
  Checkbox,
  Flex,
  Grid,
  Link,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  VStack
} from "@chakra-ui/react";
import {ListLogo} from "@dex/components/logo";
import {chains} from "@src/wagmi";
import {getBlockExplorerLink, getBlockExplorerName} from "@dex/utils";
import CronosIcon from "@src/components-v2/shared/icons/cronos";
import {WarningIcon} from "@chakra-ui/icons";
import {PrimaryButton} from "@src/components-v2/foundation/button";

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveChainId()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  const { data: hasRiskToken } = useQuery({
    queryKey: ['has-risks', tokens],

    queryFn: async () => {
      return false;
      // const result = await Promise.all(tokens.map((token) => fetchRiskToken(token.address, token.chainId)))
      // return result.some((r) => r.riskLevel >= TOKEN_RISK.MEDIUM)
    },

    enabled: Boolean(tokens),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  return (
    <VStack align='stretch' px={4} pb={4} spacing={6}>
      <Alert status='warning'>
        <AlertIcon />
        <VStack align='stretch' fontSize='sm'>
          <Text>Anyone can create tokens on {chains.find((c) => c.id === chainId)?.name} with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.</Text>
          <Text>If you purchase a fraudulent token, you may be exposed to permanent loss of funds.</Text>
        </VStack>
      </Alert>

      {tokens.map((token) => {
        const list = token.chainId && inactiveTokenList?.[token.chainId as ChainId]?.[token.address]?.list
        const address = token.address ? `${truncateHash(token.address)}` : null
        return (
          <Flex
            flexDirection={['column', 'column', 'row']}
            key={token.address}
            alignItems={['left', 'left', 'center']}
            justifyContent="space-between"
          >
            <Grid gridTemplateRows="1fr 1fr 1fr 1fr" gridGap="4px">
              {list !== undefined ? (
                <Tag
                  variant="outline"
                  colorScheme='green'
                  scale="sm"
                >
                  {!!list.logoURI && (
                    <TagLeftIcon>
                      <ListLogo logoURI={list.logoURI} size="12px" />
                    </TagLeftIcon>
                  )}
                  <TagLabel>via {list.name}</TagLabel>
                </Tag>
              ) : (
                <Tag variant="outline" colorScheme='red' scale="sm">
                  <TagLeftIcon>
                    <WarningIcon color="failure" />
                  </TagLeftIcon>
                  <TagLabel>Unknown Source</TagLabel>
                </Tag>
              )}
              <Flex alignItems="center">
                <Text mr="8px">{token.name}</Text>
                <Text>({token.symbol})</Text>
              </Flex>
              {!!token.chainId && (
                <>
                  <Text mr="4px">{address}</Text>
                  <Link href={getBlockExplorerLink(token.address, 'address', token.chainId)} isExternal>
                    View on {getBlockExplorerName(token.chainId)}{' '}
                    {token.chainId === ChainId.CRONOS && <CronosIcon boxSize={5}/>}
                  </Link>
                </>
              )}
            </Grid>
          </Flex>
        )
      })}

      <Grid gridTemplateRows="1fr 1fr" gridGap="4px">
        <Checkbox
          scale="sm"
          name="confirmed"
          type="checkbox"
          checked={confirmed}
          onChange={() => setConfirmed(!confirmed)}
        >
          {hasRiskToken ? 'I acknowledge the risk' : 'I understand'}
        </Checkbox>
        <PrimaryButton
          isDisabled={!confirmed}
          onClick={() => {
            tokens.forEach((token) => {
              const inactiveToken = chainId && inactiveTokenList?.[token.chainId as ChainId]?.[token.address]
              let tokenToAdd = token
              if (inactiveToken) {
                tokenToAdd = new WrappedTokenInfo({
                  ...token,
                  logoURI: inactiveToken.token.logoURI,
                  name: token.name || inactiveToken.token.name,
                })
              }
              addToken(tokenToAdd)
            })
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
        >
          {hasRiskToken ? 'Proceed' : 'Import'}
        </PrimaryButton>
      </Grid>
    </VStack>
  )
}

export default ImportToken
