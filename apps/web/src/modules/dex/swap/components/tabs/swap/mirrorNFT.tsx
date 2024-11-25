import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { Card } from '@src/components-v2/foundation/card';
import useMirrorNFT from '@dex/swap/imported/pancakeswap/web/hooks/useMirrorNFT';
// import { Link } from '@chakra-ui/react';
import Link from 'next/link';
import { useActiveChainId } from '@dex/swap/imported/pancakeswap/web/hooks/useActiveChainId';
import { CHAIN_QUERY_NAME } from '@src/config/chains';
import { zeroAddress } from 'viem';

interface MirrorNFTProps {
  currencyId: string | undefined;
}

const MirrorNFT: FC<MirrorNFTProps> = ({ currencyId }) => {
  const mirrorNFT = useMirrorNFT(currencyId);
  const chainId = useActiveChainId();
  const chainPath = CHAIN_QUERY_NAME[chainId.chainId];
  const isShow = mirrorNFT !== zeroAddress;
  return (
    <Box display={isShow ? 'flex' : 'none'} w='full' justifyContent={"flex-end"} fontSize='sm'>
        <Link href={`/collection/${chainPath}/${mirrorNFT}`}>{`Go to the Mirror NFT Collection  >> `}</Link>
    </Box>
  );
};

export default MirrorNFT;
