import React from "react";
import Head from "next/head";
import {appConfig} from "@src/config";

const config = appConfig();

type PageHeadProps = {
    title: string,
    description?: string,
    image?: string,
    url?: string
}

const PageHead = ({ title, description, image, url }: PageHeadProps) => {
  return (
    <Head>
      <title>{`${title} | Ebisu's Bay Marketplace`}</title>
      <meta name="title" key="title" content={title} />
      <meta name="description" key="desc" content={description} />

      <meta property="og:title" key="og_title" content={title} />
      {description && <meta property="og:description" key="og_desc" content={description} /> }
      {url && <meta property="og:url" key="og_url" content={`${config.urls.app.replace(/\/$/, '')}${url}`} />}
      {image && <meta property="og:image" key="og_img" content={image} />}

      <meta name="twitter:card" key="twitter_card" content="summary_large_image" />
      <meta property="twitter:title" key="twitter_title" content={title} />
      {description && <meta property="twitter:description" key="twitter_desc" content={description} />}
      {url && <meta property="twitter:url" key="twitter_url" content={`${config.urls.app.replace(/\/$/, '')}${url}`} />}
      {image && <meta property="twitter:image" key="twitter_img" content={image} />}

      {/*<link rel="canonical" key="link_canonical" href='https://ebisusbay.com' />*/}
    </Head>
  );
};

export default PageHead;