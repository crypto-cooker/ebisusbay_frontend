import {GetServerSidePropsContext} from "next";
import {ApiService} from "@src/core/services/api-service";
import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React from "react";
import {DefaultContainer} from "@src/components-v2/shared/containers";
import ManageDealView from "@src/components-v2/feature/deal/manage";
import {Deal} from "@src/core/services/api-service/mapi/types";
import ImageService from "@src/core/services/image";
import {QueryClient, useQuery} from "@tanstack/react-query";
import {getProfile} from "@src/core/cms/endpoints/profile";
import {useParams} from "next/navigation";
import {Center, Spinner, Text} from "@chakra-ui/react";

interface ManageDealProps {
  initialDeal?: Deal;
}

const ManageDeal = ({initialDeal}: ManageDealProps) => {
  const params = useParams()

  // Hack to fix hydration issues on subsequent page navigations
  const dealId = initialDeal?.id || (params?.id as string);

  const { data: deal, status, error } = useQuery({
    queryKey: ['Deal', dealId],
    queryFn: () => ApiService.withKey(process.env.EB_API_KEY).getDeal(dealId),
    initialData: initialDeal ?? undefined,
  });

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
      {status === 'pending' ? (
        <Center>
          <Spinner size='lg' />
        </Center>
      ) : status === 'error' ? (
        <Center>
          <Text>{(error as any).message}</Text>
        </Center>
      ) : (
        <DefaultContainer mt={4}>
          <ManageDealView deal={deal} />
        </DefaultContainer>
      )}
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

    const queryClient = new QueryClient();
    const deal = await queryClient.fetchQuery({
      queryKey: ['Deal', dealId],
      queryFn: () => ApiService.withKey(process.env.EB_API_KEY).getDeal(dealId),
    });

    if (!deal) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        initialDeal: deal
      }
    };
  } catch (e) {
    return {
      notFound: true
    }
  }
};