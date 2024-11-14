import Pair from '@src/components-v2/feature/info/pairs/pair-page';
import InfoPageLayout from '@src/components-v2/feature/info';
import { useRouter } from 'next/router';

const PairPage = () => {
  const router = useRouter();
  const { address } = router.query;
  return (
    <>
      <InfoPageLayout>
        <Pair routeAddress={String(address)} />
      </InfoPageLayout>
    </>
  );
};

export default PairPage;
