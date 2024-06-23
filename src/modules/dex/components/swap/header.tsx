import {Button, Wrap} from "@chakra-ui/react";
import React, {useCallback} from "react";
import {SwapTab} from "src/modules/dex/swap/constants";
import {useRouter} from "next/router";
import {useSwapAndLimitContext} from "@dex/imported/state/swap/hooks";
import {useSwapPageState} from "@dex/swap/state/swap/hooks";

export default function SwapHeader({ compact }: { compact: boolean }) {
  const router = useRouter();
  const [swapPageState, setSwapPageState] = useSwapPageState();

  const handleChangeTab = useCallback((tab: SwapTab) => {
    setSwapPageState((prev) => ({
      ...prev,
      currentTab: tab,
    }));
  }, [router, swapPageState.currentTab])

  return (
    <Wrap justify='center'>
      <Button
        onClick={() => handleChangeTab(SwapTab.Swap)}
        isActive={swapPageState.currentTab === SwapTab.Swap}
      >
        Swap
      </Button>
      <Button
        onClick={() => handleChangeTab(SwapTab.Limit)}
        isActive={swapPageState.currentTab === SwapTab.Limit}
      >
        Limit
      </Button>
      <Button
        onClick={() => handleChangeTab(SwapTab.Send)}
        isActive={swapPageState.currentTab === SwapTab.Send}
      >
        Buy
      </Button>
    </Wrap>
  )
}