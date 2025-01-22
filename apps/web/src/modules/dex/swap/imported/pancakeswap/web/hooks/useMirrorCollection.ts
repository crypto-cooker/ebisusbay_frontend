import { useCallback, useEffect, useState } from 'react';
import { getMirrorCollection } from '../utils/getMirrorCollection';
import { useActiveChainId } from './useActiveChainId';
import { Address, erc721Abi, zeroAddress } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { getStats } from '@src/components-v2/feature/collection/collection-721';
import { ApiService } from '@src/core/services/api-service';
import { readContract } from '@wagmi/core';
import { wagmiConfig } from '@src/wagmi';

const useMirrorCollection = (currencyId: string | undefined) => {
  const [mirrorCollection, setMirrorCollection] = useState<any>(null);
  const { chainId } = useActiveChainId();

  const getCollection = useCallback(async () => {
    const collectionAddress = await getMirrorCollection(currencyId, chainId);
    if (collectionAddress != zeroAddress) {
      const collections = await ApiService.withoutKey().getCollections({
        ['address']: [collectionAddress.toLowerCase()],
        chain: chainId,
      });
      const collection = collections.data[0] ?? null;
      setMirrorCollection(collection);
    } else setMirrorCollection(null);
  }, [currencyId, chainId]);

  useEffect(() => {
    getCollection();
  }, [currencyId, chainId]);

  const getBaseERC20Address = useCallback(async () => {
    try {
      const baseERC20Address: Address = await readContract(wagmiConfig, {
        address: mirrorCollection.address as Address,
        abi: [{
          type: 'function',
          stateMutability: 'view',
          outputs: [{ type: 'address', name: '', internalType: 'address' }],
          name: 'baseERC20',
          inputs: [],
        }],
        functionName: "baseERC20",
        chainId
      });
      return baseERC20Address;
    } catch (e) {
      console.log(e);
      return zeroAddress;
    }
  }, [chainId, mirrorCollection])

  const getTotalSupply = useCallback(async () => {
    const address = await getBaseERC20Address();
    if (address == zeroAddress) return 0;
    try {
      const totalSupply = await readContract(wagmiConfig, {
        address: mirrorCollection.address as Address,
        abi: erc721Abi,
        functionName: "totalSupply",
        chainId
      })
      return totalSupply;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }, [chainId, mirrorCollection])

  const { data: collectionStats } = useQuery({
    queryKey: ['CollectionStats', currencyId],
    queryFn: async () => {
      const collectionStats = await getStats(mirrorCollection, null, mirrorCollection.mergedAddresses);
      const totalSupply = await getTotalSupply();
      if (totalSupply != 0) {
        collectionStats.totalSupply = totalSupply;
      }
      return collectionStats
    },
    refetchOnWindowFocus: false
  });

  return { mirrorCollection, collectionStats };
};

export default useMirrorCollection;
