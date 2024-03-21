import {GetServerSidePropsContext} from "next";
import {ApiService} from "@src/core/services/api-service";
import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React from "react";
import {DefaultContainer} from "@src/components-v2/shared/default-container";
import ManageSwapView from "@src/components-v2/feature/swap/manage";

interface ManageSwapProps {
  swap: any;
}

const ManageSwap = ({swap}: ManageSwapProps) => {

  return (
    <>
      <PageHead
        title={'Swap NFTs on Ebisu\'s Bay'}
        description='Reveal unique value opportunities by swapping NFTs and tokens directly'
      />
      <PageHeader
        title={'View Swap'}
      />

      <DefaultContainer mt={4}>
        <ManageSwapView swap={swap} />
      </DefaultContainer>
    </>
  );
}

export default ManageSwap;


export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  const swapId = params?.id as string;
  if (!swapId) {
    return {
      notFound: true
    }
  }

  const swap = await ApiService.withoutKey().getSwap(swapId);
  if (!swap) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      swap
    }
  };
};