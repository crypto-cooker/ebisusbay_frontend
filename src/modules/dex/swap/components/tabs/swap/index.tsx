// import { SmartRouter } from '@pancakeswap/smart-router/evm'
// import { useMemo } from 'react'
// import { CommitButton } from './containers/CommitButton'
// import { useCheckInsufficientError } from './hooks/useCheckSufficient'
import FormMain from "@dex/swap/components/tabs/swap/form";
// import {SmartRouter} from "@pancakeswap/smart-router";
// import {useCheckInsufficientError} from "@eb-pancakeswap-web/views/Swap/V3Swap/hooks/useCheckSufficient";
// import {useAllTypeBestTrade} from "@eb-pancakeswap-web/hooks/useAllTypeBestTrade";
// import {useSwapBestTrade} from "@eb-pancakeswap-web/hooks/useSwapBestTrade";
// import {useDerivedSwapInfo} from "@eb-pancakeswap-web/state/swap/hooks";

export function SwapForm() {
  // const {
  //   bestTrade,
  //   ammTrade,
  //   mmTrade,
  //   isMMBetter,
  //   tradeError,
  //   tradeLoaded,
  //   refreshTrade,
  //   refreshDisabled,
  //   pauseQuoting,
  //   resumeQuoting,
  // } = useAllTypeBestTrade()
  // const {refresh, syncing, isStale, error, isLoading, trade} = useSwapBestTrade();

  // const  test = useDerivedSwapInfo();

  // const ammPrice = useMemo(() => (ammTrade ? SmartRouter.getExecutionPrice(ammTrade) : undefined), [ammTrade])
  // const insufficientFundCurrency = useCheckInsufficientError(ammTrade)
  // const commitHooks = useMemo(() => {
  //   return {
  //     beforeCommit: pauseQuoting,
  //     afterCommit: resumeQuoting,
  //   }
  // }, [pauseQuoting, resumeQuoting])

  return (
    <>
      {/*<FormHeader onRefresh={refreshTrade} refreshDisabled={refreshDisabled} />*/}
      <FormMain
        // tradeLoading={isLoading}
        // pricingAndSlippage={
        //   <PricingAndSlippage priceLoading={!tradeLoaded} price={ammPrice ?? undefined} showSlippage={!isMMBetter} />
        // }
        // inputAmount={trade?.inputAmount}
        // outputAmount={trade?.outputAmount}
        // swapCommitButton={
        //   <CommitButton
        //     trade={isMMBetter ? mmTrade : ammTrade}
        //     tradeError={tradeError}
        //     tradeLoaded={tradeLoaded}
        //     {...commitHooks}
        //   />
        // }
      />

    {/*  <BuyCryptoLink currency={insufficientFundCurrency} />*/}

    {/*  {isMMBetter ? (*/}
    {/*    <MMTradeDetail loaded={!mmTrade.mmOrderBookTrade.isLoading} mmTrade={mmTrade.mmTradeInfo} />*/}
    {/*  ) : (*/}
    {/*    <TradeDetails loaded={tradeLoaded} trade={ammTrade} />*/}
    {/*  )}*/}
    {/*  {(shouldShowMMLiquidityError(mmTrade?.mmOrderBookTrade?.inputError) || mmTrade?.mmRFQTrade?.error) &&*/}
    {/*    !ammTrade && (*/}
    {/*      <Box mt="5px">*/}
    {/*        <MMLiquidityWarning />*/}
    {/*      </Box>*/}
    {/*    )}*/}
    </>
  )
}
