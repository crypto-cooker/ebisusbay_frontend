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

export default function Page() {
  const router = useRouter();

  const { currencyIdA, currencyIdB } = useCurrencyParams()

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

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
  }, [router, currencyIdA, currencyIdB]);

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
      <StandardContainer mt={4} maxW='container.sm'>
        <AddLiquidity />
      </StandardContainer>
    </>
  )
}
