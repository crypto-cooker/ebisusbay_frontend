import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import BridgePage from "@dex/bridge/components";
import {StandardContainer} from "@src/components-v2/shared/containers";
import {useState} from "react";
import { useRouter } from 'next/navigation';
import Subnavigation from "@dex/components/subnavigation";

export default function Page() {
  return (
    <>
      <PageHead
        title='Ryoshi Swap'
        description='Trade tokens instantly with low fees'
      />
      <PageHeader
        title='Ryoshi Swap'
        subtitle='Trade tokens instantly with low fees'
      />
      <Subnavigation primaryTabKey='Bridge' />
      <StandardContainer mt={4} maxW='container.md'>
        <BridgePage />
      </StandardContainer>
    </>
  )
}
