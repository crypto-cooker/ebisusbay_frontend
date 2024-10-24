
import InfoPageLayout from '@src/components-v2/feature/info';
import Pairs from '@src/components-v2/feature/info/pairs';
import { useRouter } from 'next/router';

const PairPage = () => {
  const router = useRouter();
  
  return (
    <>
    <InfoPageLayout>
        <Pairs />
    </InfoPageLayout>
    </>
  );
}
export default PairPage