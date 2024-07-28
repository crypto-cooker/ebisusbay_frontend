import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { Fragment, memo } from 'react'
import {Flex, Text} from "@chakra-ui/react";
import {ChevronRightIcon} from "@chakra-ui/icons";

export default memo(function SwapRoute({ trade }: { trade: Trade<Currency, Currency, TradeType> }) {
  return (
    <Flex flexWrap="wrap" width="100%" justifyContent="flex-end" alignItems="center">
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          <Fragment key={i}>
            <Flex alignItems="end" fontWeight='bold'>
              <Text fontSize="14px" ml="0.125rem" mr="0.125rem">
                {token.symbol}
              </Text>
            </Flex>
            {!isLastItem && <ChevronRightIcon width="12px" />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
