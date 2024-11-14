import { Box } from '@chakra-ui/react';
import { StandardContainer } from '@src/components-v2/shared/containers';
import Tokens from '@src/components-v2/feature/info/tokens';
import InfoPageLayout from '@src/components-v2/feature/info';

const TokenPage = () => {
  return (
    <>
      <InfoPageLayout>
        <Tokens />
      </InfoPageLayout>
    </>
  );
};

export default TokenPage;
