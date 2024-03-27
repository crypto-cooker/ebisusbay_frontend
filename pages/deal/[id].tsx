import {GetServerSidePropsContext} from "next";
import {ApiService} from "@src/core/services/api-service";
import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React from "react";
import {DefaultContainer} from "@src/components-v2/shared/default-container";
import ManageDealView from "@src/components-v2/feature/deal/manage";

interface ManageDealProps {
  deal: any;
}

const ManageDeal = ({deal}: ManageDealProps) => {

  return (
    <>
      <PageHead
        title={'Swap NFTs on Ebisu\'s Bay'}
        description='Reveal unique value opportunities by swapping NFTs and tokens directly'
      />
      <PageHeader
        title={'View Deal'}
      />

      <DefaultContainer mt={4}>
        <ManageDealView deal={deal} />
      </DefaultContainer>
    </>
  );
}

export default ManageDeal;


export const getServerSideProps = async ({ params, query }: GetServerSidePropsContext) => {
  const dealId = params?.id as string;
  if (!dealId) {
    return {
      notFound: true
    }
  }

  const deal = await ApiService.withoutKey().getDeal(dealId);
  if (!deal) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      deal
    }
  };
};