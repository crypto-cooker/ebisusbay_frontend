import {useQuery} from "@tanstack/react-query";
import {useCallback, useEffect, useState} from "react";
import {ethers} from "ethers";
import {shortAddress} from "@src/utils";
import {ApiService} from "@src/core/services/api-service";

const useGetProfilePreview = (initialAddress?: string) => {
  const [address, setAddress] = useState<string | null>(initialAddress ?? null);

  const {data:profile, isPending} = useQuery({
      queryKey: ['ProfilePreview', address],
      queryFn: () => ApiService.withoutKey().getProfile(address!),
      enabled: !!address,
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 11,
      // initialData: {}
    }
  );

  const fetchProfilePreview = useCallback((address: string) => {
    setAddress(address);
  }, []);

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    }
  }, [initialAddress]);

  let username: string = shortAddress(address);
  if (profile?.data?.username) {
    try {
      if (profile.data.username.startsWith('0x')) {
        username = shortAddress(ethers.utils.getAddress(profile.data.username));
      } else {
        username = profile.data.username;
      }
    } catch (e) {
      username = profile.data.username;
    }
  }

  return {
    fetchProfilePreview,
    username,
    avatar: profile?.data?.profilePicture,
    verified: profile?.data?.isVerified,
    address,
    isLoading: isPending
  };
}

export default useGetProfilePreview;