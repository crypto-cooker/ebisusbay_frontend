import {GetServerSidePropsContext} from "next";
import {ApiService} from "@src/core/services/api-service";
import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React from "react";
import {DefaultContainer} from "@src/components-v2/shared/default-container";
import ManageDealView from "@src/components-v2/feature/deal/manage";
import {Deal} from "@src/core/services/api-service/mapi/types";
import ImageService from "@src/core/services/image";

interface ManageDealProps {
  deal: Deal;
}

const ManageDeal = ({deal}: ManageDealProps) => {

  return (
    <>
      <PageHead
        title={'Swap NFTs on Ebisu\'s Bay'}
        description='Reveal unique value opportunities by swapping NFTs and tokens directly'
        image={ImageService.translate('/img/background/deal.png').convert()}
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

  try {
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
  } catch (e) {
    return {
      notFound: true
    }
  }
};