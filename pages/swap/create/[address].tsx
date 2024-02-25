import {UserSwapView} from "@src/components-v2/feature/swap/user";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import useBarterSwap from "@src/components-v2/feature/swap/use-barter-swap";

const SwapWithUser = () => {
  const router = useRouter();
  const { setUserAAddress } = useBarterSwap();
  const address = router.query.address as string;

  useEffect(() => {
    setUserAAddress(address);
  }, [router.query.address]);

  return (
    <>
      <PageHeader title={'Create a Swap'} />
      <UserSwapView address={address} />
    </>
  )
}

export default SwapWithUser;