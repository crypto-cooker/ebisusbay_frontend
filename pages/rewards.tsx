import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import React, {useMemo} from "react";
import {Box, Center} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {ApiService} from "@src/core/services/api-service";
import {Spinner} from "react-bootstrap";
import {SortKeys} from "@src/components-v2/shared/responsive-table/responsive-collections-table";
import ResponsiveRewardsCollectionsTable
  from "@src/components-v2/shared/responsive-table/responsive-rewards-collections-table";
import InfiniteScroll from "react-infinite-scroll-component";

const Rewards = () => {
  const {data, error, status,} = useQuery(
    ['RewardsCollections'],
    () => ApiService.withoutKey().getRewardedEntities(7),
    {
      staleTime: 1
    }
  )

  console.log('DATA', data);
  const content = useMemo(() => {
    return status === "loading" ? (
      <Center>
        <Spinner />
      </Center>
    ) : status === "error" ? (
      <Box textAlign='center'>
        Error: {(error as any).message}
      </Box>
    ) : (
      <ResponsiveRewardsCollectionsTable
        data={data}
        onSort={() => {}}
      />
    )
  }, [data, status]);

  return (
    <Box>
      <PageHead
        title="Rewards"
        description="View the top performing collections on Ebisu's Bay Marketplace"
        url="/collections"
      />
      <PageHeader
        title={'Get Rewarded With FRTN'}
        subtitle='Earn FRTN for listing and trading NFTs on the platform. Stake your FRTN for even more rewards and benefits!'
      />
      <section className="gl-legacy container no-top">
      {content}
      </section>
    </Box>
  )
}

export default Rewards;