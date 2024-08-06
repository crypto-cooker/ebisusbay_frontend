import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useCallback, useEffect} from "react";
import {useCurrencyParams} from "@eb-pancakeswap-web/hooks/useCurrencyParams";
import {useCurrency} from "@eb-pancakeswap-web/hooks/tokens";
import {useRouter} from "next/router";
import {StandardContainer} from "@src/components-v2/shared/containers";
import {Card} from "@src/components-v2/foundation/card";
import {Alert, AlertIcon, Box, Heading, HStack, IconButton} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import NextLink from "next/link";
import AddLiquidity from "@dex/liquidity/add";
import {usePollBlockNumber} from "@eb-pancakeswap-web/state/block/hooks";

function GlobalHooks() {
  usePollBlockNumber()
  return null
}

export default function Page() {
  const router = useRouter();

  const { currencyIdA, currencyIdB } = useCurrencyParams()

  const handleRefresh = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          currency: [currencyIdA!, currencyIdB!],
        },
      },
      undefined,
      { shallow: true },
    )
  }, [router, currencyIdA, currencyIdB])

  const handleBack = useCallback(() => {

  }, []);

  useEffect(() => {
    handleRefresh();
  }, [currencyIdA, currencyIdB]);

  return (
    <>
      <PageHead
        title='Ryoshi Swap'
        description='Trade tokens instantly with low fees'
      />
      <PageHeader
        title='Ryoshi Swap'
        subtitle='Trade tokens instantly with low fees'
      />
      <GlobalHooks />
      <StandardContainer mt={4} maxW='container.sm'>
        <AddLiquidity
          currencyIdA={currencyIdA}
          currencyIdB={currencyIdB}
        />
      </StandardContainer>
    </>
  )
}
