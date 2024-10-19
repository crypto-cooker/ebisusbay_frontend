import { Box } from '@chakra-ui/react';
import { StandardContainer } from '@src/components-v2/shared/containers';
import PageHead from '@src/components-v2/shared/layout/page-head';
import PageHeader from '@src/components-v2/shared/layout/page-header';
import InfoPage from '@src/components-v2/feature/info';

export default function Info() {
  return (
    <>
      <PageHead title="Info and Analytics" description="Information of the tokens and pools" />
      <PageHeader title="Info and Analytics" subtitle="Information of the tokens and pools" />
      <StandardContainer mt={4} maxW="container.md">
        <InfoPage />
      </StandardContainer>
    </>
  );
}
