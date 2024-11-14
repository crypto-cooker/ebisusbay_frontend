import PageHead from "@src/components-v2/shared/layout/page-head";
import PageHeader from "@src/components-v2/shared/layout/page-header";
import BridgePage from "@dex/bridge/components";
import {StandardContainer} from "@src/components-v2/shared/containers";
import Subnavigation from "@dex/components/subnavigation";

export default function Page() {
  return (
    <>
      <PageHead
        title='Ryoshi Bridge'
        description='Bridge tokens instantly with low fees'
      />
      <PageHeader
        title='Ryoshi Bridge'
        subtitle='Bridge tokens instantly with low fees'
      />
      <Subnavigation primaryTabKey='Bridge' />
      <StandardContainer mt={4} maxW='container.md'>
        <BridgePage />
      </StandardContainer>
    </>
  )
}
