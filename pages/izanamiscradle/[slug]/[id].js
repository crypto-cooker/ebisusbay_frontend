import React, {memo, useEffect, useState} from 'react';
import {caseInsensitiveCompare, humanize, isAddress, isBundle, relativePrecision} from '@src/utils';
import Nft1155 from '@src/components-v2/feature/nft/nft1155';
import Nft721 from '@src/components-v2/feature/nft/nft721';
import {appConfig} from "@src/Config";
import PageHead from "@src/components-v2/shared/layout/page-head";
import {getNft} from "@src/core/api/endpoints/nft";

const config = appConfig();

const Nft = ({ slug, id, nft, collection }) => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setInitialized(true);
    console.log("id: " + id);
    console.log("slug: " + slug);
  }, [slug, id]);

  return (
    <>
      <RdLand nftId={id} boxSize={368} specificNFT={true}/>
    </>
  );
};
export default memo(Nft);
