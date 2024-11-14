import { useRouter } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import InfoNav from './info-nav';
import PageHead from '@src/components-v2/shared/layout/page-head';
import PageHeader from '@src/components-v2/shared/layout/page-header';
import { StandardContainer } from '@src/components-v2/shared/containers';

interface InfoPageLayoutProps {
  children: ReactNode;
}

const InfoPageLayout = ({ children }: InfoPageLayoutProps) => {
  return (
    <>
      <PageHead title="Info and Analytics" description="Information of the tokens and pools" />
      <PageHeader title="Info and Analytics" subtitle="Information of the tokens and pools" />
      <InfoNav />
      <StandardContainer>{children}</StandardContainer>
    </>
  );
};

export default InfoPageLayout;
