import React, {useEffect, useState} from "react";
import {Box, Text} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";
import styles from "@src/Components/BattleBay/Areas/BattleBay.module.scss";
import RdLand from "@src/components-v2/feature/ryoshi-dynasties/components/rd-land";
import PageHead from "@src/components-v2/shared/layout/page-head";

import { useRouter } from 'next/router'

  const LandDisplay = ({slug}) => {
    return (
    <>
      <RdLand nftId={slug} boxSize={368} specificNFT={true}/>
    </>
  );
};
export default LandDisplay;

export const getServerSideProps = async ({ params }) => {
  const slug = params?.slug;

  return {
    props: {
      slug: slug,
    },
  };
};