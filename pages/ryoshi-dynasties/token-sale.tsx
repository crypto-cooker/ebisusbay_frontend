import {NextPage} from "next";
import React from "react";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Box} from "@chakra-ui/react";
import BankerScene from "@src/components-v2/feature/ryoshi-dynasties/token-sale/banker";
import localFont from "next/font/local";
import {useRouter} from "next/router";

const gothamBook = localFont({ src: '../../src/fonts/Gotham-Book.woff2' })

const TokenSale: NextPage = () => {
  const router = useRouter();

  const handleExitBanker = () => {
    router.back();
  }

  return (
    <>
      <PageHead
        title="Fortune Token Sale"
        description="Participate in the $Fortune Token Sale and benefit from instant access to troops, exclusive #NFTs, beta testing and free registration for season 1 of Ryoshi Dynasties!"
        url="/ryoshi-dynasties/token-sale"
      />
      <Box
        position='relative'
        h='calc(100vh - 74px)'
        className={gothamBook.className}
      >
        <Box>
          <BankerScene onExit={handleExitBanker} isVisible={true} />
        </Box>
      </Box>
    </>
  )
}

export default TokenSale;