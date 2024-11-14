import Token from '@src/components-v2/feature/info/tokens/token-page';
import InfoPageLayout from '@src/components-v2/feature/info';
import { useRouter } from 'next/router';

const TokenPage = () => {
  const router = useRouter();
  const { address } = router.query;
  return (
    <>
      <InfoPageLayout>
        <Token routeAddress={String(address)} />
      </InfoPageLayout>
    </>
  );
};

export default TokenPage;
