import { useEffect, useState } from 'react';
import stakingPlatforms from '@src/core/data/staking-platforms.json';

export const useGetStakingPlatform = (address: string) => {
  const [stakingPlatform, setStakingPlatform] = useState<any>();

  useEffect(() => {
    const platform = Object.entries(stakingPlatforms).find(([key, platform]: [key: string, platform: any]) => {
      const collections = platform.collections.map((c: string) => c.toLowerCase());
      return collections.includes(address.toLowerCase());
    })

    setStakingPlatform(!!platform ? platform[1] : undefined);
  }, [address]);

  return { stakingPlatform };
};

export default useGetStakingPlatform;