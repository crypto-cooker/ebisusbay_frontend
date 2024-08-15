import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import {StandardContainer} from "@src/components-v2/shared/containers";
import RemoveLiquidity from "@dex/liquidity/remove";
import React, {useCallback, useEffect} from "react";
import {useRouter} from "next/router";
import {useCurrency} from "@eb-pancakeswap-web/hooks/tokens";

export default function Page() {
  const router = useRouter();

  const [currencyIdA, currencyIdB] = router.query.currency || []

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

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
  }, [router, currencyIdA, currencyIdB]);

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
      <StandardContainer mt={4} maxW='container.sm'>
        <RemoveLiquidity
          currencyIdA={currencyIdA}
          currencyIdB={currencyIdB}
          currencyA={currencyA}
          currencyB={currencyB}
        />
      </StandardContainer>
    </>
  )
}