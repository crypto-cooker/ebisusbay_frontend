import Head from "next/head";
import React from "react";

export const DefaultHead = () => {
  return (
    <Head>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Ebisu's Bay Marketplace</title>

      {/* Primary Meta Tags */}
      <meta name="title" content="Ebisu's Bay | GameFi - NFT Market - DEX" />
      <meta
        name="description"
        content="A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance."
      />
      <meta name="keywords" content="NFT, NFTMarket, DEX, Cronos, CronosNFT, NFT Art, CroFam"/>

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="Ebisu's Bay Marketplace" />
      <meta property="og:type" content="website" />
      <meta property="og:url" key="og_url" content="https://app.ebisusbay.com" />
      <meta property="og:title" key="og_title" content="Ebisu's Bay | GameFi - NFT Market - DEX" />
      <meta
        property="og:description"
        key="og_desc"
        content="A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance."
      />
      <meta property="og:image" key="og_img" content="https://app.ebisusbay.com/img/background/banner-default.webp" />

      {/* Twitter */}
      <meta property="twitter:site" content="@EbisusBay" />
      <meta property="twitter:card" key="twitter_card" content="summary_large_image" />
      <meta property="twitter:url" key="twitter_url" content="https://app.ebisusbay.com" />
      <meta property="twitter:title" key="twitter_title" content="Ebisu's Bay | GameFi - NFT Market - DEX" />
      <meta
        property="twitter:description"
        key="twitter_desc"
        content="A dynamic platform that combines NFT and DEX trading with GameFi, enabling users to battle for market dominance."
      />
      <meta property="twitter:image" key="twitter_img" content="https://app.ebisusbay.com/img/background/banner-default.webp" />
    </Head>
  )
}

export default DefaultHead;