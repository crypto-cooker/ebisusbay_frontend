import { useCallback, useEffect, useState } from 'react';
import { getMirrorCollection } from '../utils/getMirrorColletion';
import { useActiveChainId } from './useActiveChainId';
import { fetchCollection } from '@root/pages/collection/[chain]/[slug]';
import { zeroAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@src/components-v2/feature/collection/collection-721';

const useMirrorCollection = (currencyId: string | undefined) => {
  const [mirrorCollection, setMirrorCollection] = useState<any>(null);
  const chainId = useActiveChainId();

  const getCollection = useCallback(async () => {
    const collectionAddress = await getMirrorCollection(currencyId, chainId.chainId);
    if (collectionAddress != zeroAddress) {
      const collection = await fetchCollection(collectionAddress.toLowerCase(), chainId.chainId);
      setMirrorCollection(collection);
    } else setMirrorCollection(null);
  }, [currencyId, chainId.chainId]);

  useEffect(() => {
    getCollection();
  }, [currencyId, chainId.chainId]);

  const { data: collectionStats } = useQuery({
    queryKey: ['CollectionStats', mirrorCollection?.address],
    queryFn: () => getStats(mirrorCollection, null, mirrorCollection?.mergedAddresses),
    refetchOnWindowFocus: false
  });

  return {mirrorCollection, collectionStats};
};

export default useMirrorCollection;
