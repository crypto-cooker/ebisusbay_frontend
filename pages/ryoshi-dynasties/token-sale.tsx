import {NextPage} from "next";
import React from "react";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {Box} from "@chakra-ui/react";
import BankerScene from "@src/components-v2/feature/ryoshi-dynasties/token-sale/banker";
import localFont from "next/font/local";
import {useRouter} from "next/router";
import {hostedImage} from "@src/helpers/image";

const gothamBook = localFont({ src: '../../src/global/assets/fonts/Gotham-Book.woff2' })

const TokenSale: NextPage = () => {
  const router = useRouter();

  const handleExitBanker = () => {
    router.back();
  }

  return (
    <>
      <PageHead
        title="Fortune Token Sale"
        description="Be the first to access $FRTN on Cronos zkEVM"
        url="/ryoshi-dynasties/token-sale"
        image={hostedImage('/img/ryoshi/fortune-token-sale-banner.webp')}
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