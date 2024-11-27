import { useCallback, useEffect, useState } from 'react';
import { getMirrorCollection } from '../utils/getMirrorCollection';
import { useActiveChainId } from './useActiveChainId';
import { zeroAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@src/components-v2/feature/collection/collection-721';
import { ApiService } from '@src/core/services/api-service';

const useMirrorCollection = (currencyId: string | undefined) => {
  const [mirrorCollection, setMirrorCollection] = useState<any>(null);
  const chainId = useActiveChainId();

  const getCollection = useCallback(async () => {
    const collectionAddress = await getMirrorCollection(currencyId, chainId.chainId);
    if (collectionAddress != zeroAddress) {
      const collections = await ApiService.withoutKey().getCollections({
        ['address']: [collectionAddress.toLowerCase()],
        chain: chainId.chainId,
      });
      const collection = collections.data[0] ?? null;
      setMirrorCollection(collection);
    } else setMirrorCollection(null);
  }, [currencyId, chainId.chainId]);

  useEffect(() => {
    getCollection();
  }, [currencyId, chainId.chainId]);

  const { data: collectionStats } = useQuery({
    queryKey: ['CollectionStats', mirrorCollection?.address],
    queryFn: () => getStats(mirrorCollection, null, mirrorCollection?.mergedAddresses),
    refetchOnWindowFocus: false,
  });

  return { mirrorCollection, collectionStats };
};

export default useMirrorCollection;
