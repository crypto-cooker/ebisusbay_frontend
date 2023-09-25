import {useCallback, useState} from 'react';

import {updateCollection} from "@src/core/cms/next/collections";
import {updateAvatar, updateBanner, updateCard} from "@src/core/cms/endpoints/collections";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

export const useUpdate = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const {requestSignature} = useEnforceSignature();

  const update = useCallback(async (address, newData, collectionAddress) => {

    const { collectionInfo, collectionAvatar, collectionBanner, collectionCard } = newData;

    setResponse({
      ...response,
      isLoading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const payload = await updateCollection({ signature: signature, address, collectionAddress }, collectionInfo);
      if (collectionAvatar.collectionPicture[0]?.file?.name) {
        const formData = new FormData();
        formData.append('avatar', collectionAvatar.collectionPicture[0].file);
        await updateAvatar({ signature: signature, address, collectionAddress}, formData);
      }
      
      if (collectionBanner.banner[0]?.file?.name) {
        const formData = new FormData();
        formData.append('banner', collectionBanner.banner[0].file);
        await updateBanner({ signature: signature, address, collectionAddress}, formData);
      }

      if (collectionCard.card[0]?.file?.name) {
        const formData = new FormData();
        formData.append('card', collectionCard.card[0].file);
        await updateCard({ signature: signature, address, collectionAddress}, formData);
      }

      setResponse({
        isLoading: false,
        response: payload,
      });
    } catch (e) {
      console.log(e)
      setResponse({
        isLoading: false,
        response: null,
        error: e,
      });
    }
  }, [response, requestSignature]);

  return [response, update];
};

export default useUpdate;
