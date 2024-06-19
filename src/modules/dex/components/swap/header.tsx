import {Button, Wrap} from "@chakra-ui/react";
import React, {useCallback} from "react";
import {SwapTab} from "@dex/constants";
import {useRouter} from "next/router";
import {useSwapAndLimitContext} from "@dex/imported/state/swap/hooks";
import {useSwapPageState} from "@dex/swap/state/swap/hooks";

export default function SwapHeader({ compact, syncTabToUrl }: { compact: boolean; syncTabToUrl: boolean }) {
  const router = useRouter();
  const [swapPageState, setSwapPageState] = useSwapPageState();
  const { chainId, currentTab, setCurrentTab } = useSwapAndLimitContext();

  const handleChangeTab = useCallback((tab: SwapTab) => {
    setSwapPageState((prev) => ({
      ...prev,
      currentTab: tab,
    }));
  }, [router, setCurrentTab, syncTabToUrl])

  return (
    <Wrap justify='center'>
      <Button
        onClick={() => handleChangeTab(SwapTab.Swap)}
        isActive={currentTab === SwapTab.Swap}
      >
        Swap
      </Button>
      <Button
        onClick={() => handleChangeTab(SwapTab.Limit)}
        isActive={currentTab === SwapTab.Swap}
      >
        Limit
      </Button>
      <Button
        onClick={() => handleChangeTab(SwapTab.Send)}
        isActive={currentTab === SwapTab.Swap}
      >
        Buy
      </Button>
    </Wrap>
  )
}