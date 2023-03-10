import Head from "next/head";
import React from "react";

export const DefaultHead = () => {
  return (
    <Head>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Ebisu's Bay Marketplace</title>

      {/* Primary Meta Tags */}
      <meta name="title" content="Ebisu's Bay — The Leading GameFi NFT Marketplace" />
      <meta
        name="description"
        content="The first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community."
      />
      <meta name="keywords" content="NFT, NFTMarket, Cronos, CronosNFT, NFT Art, CroFam"/>

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Ebisu's Bay Marketplace" />
      <meta property="og:type" content="website" />
      <meta property="og:url" key="og_url" content="https://app.ebisusbay.com" />
      <meta property="og:title" key="og_title" content="Ebisu's Bay — The Leading GameFi NFT Marketplace" />
      <meta
        property="og:description"
        key="og_desc"
        content="The first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community."
      />
      <meta property="og:image" key="og_img" content="https://app.ebisusbay.com/img/background/banner-ryoshi-light.webp" />

      {/* Twitter */}
      <meta property="twitter:site" content="@EbisusBay" />
      <meta property="twitter:card" key="twitter_card" content="summary_large_image" />
      <meta property="twitter:url" key="twitter_url" content="https://app.ebisusbay.com" />
      <meta property="twitter:title" key="twitter_title" content="Ebisu's Bay — The Leading GameFi NFT Marketplace" />
      <meta
        property="twitter:description"
        key="twitter_desc"
        content="The first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community."
      />
      <meta property="twitter:image" key="twitter_img" content="https://app.ebisusbay.com/img/background/banner-ryoshi-light.webp" />
    </Head>
  )
}

export default DefaultHead;