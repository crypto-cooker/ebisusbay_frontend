import { useCallback, useState } from 'react';
import { getAuthSignerInStorage } from '@src/helpers/storage';

import { updateCollection } from "@src/core/cms/next/collections";
import { updateAvatar, updateBanner, updateCard} from "@src/core/cms/endpoints/collections";
import useCreateSigner from '@src/Components/Account/Settings/hooks/useCreateSigner'

export const useUpdate = () => {
  const [response, setResponse] = useState({
    isLoading: false,
    response: null,
    error: null
  });

  const [isLoading, getSigner] = useCreateSigner();

  const update = useCallback(async (address, newData, collectionAddress) => {

    const { collectionInfo, collectionAvatar, collectionBanner, collectionCard } = newData;

    setResponse({
      ...response,
      isLoading: true,
      error: null,
    });

    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
    try {
      const payload = await updateCollection({ signature: signatureInStorage, address, collectionAddress }, collectionInfo); 
      if (collectionAvatar.collectionPicture[0]?.file?.name) {
        const formData = new FormData();
        formData.append('avatar', collectionAvatar.collectionPicture[0].file);
        await updateAvatar({ signature: signatureInStorage, address, collectionAddress}, formData);
      }
      
      if (collectionBanner.banner[0]?.file?.name) {
        const formData = new FormData();
        formData.append('banner', collectionBanner.banner[0].file);
        await updateBanner({ signature: signatureInStorage, address, collectionAddress}, formData);
      }

      if (collectionCard.card[0]?.file?.name) {
        const formData = new FormData();
        formData.append('card', collectionCard.card[0].file);
        await updateCard({ signature: signatureInStorage, address, collectionAddress}, formData);
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
  } else {
    setResponse({
      isLoading: false,
      response: [],
      error: { message: 'Something went wrong' },
    });
  }

  },
    [response, getSigner]
  );

  return [response, update];
};

export default useUpdate;
