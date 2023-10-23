import {useState} from 'react';
import {createProfile, updateAvatar, updateBanner} from "@src/core/cms/endpoints/profile";
import useEnforceSignature from "@src/Components/Account/Settings/hooks/useEnforceSigner";

const useCreateSettings = () => {
  const [response, setResponse] = useState({
    loading: false,
    error: null,
  });

  const {requestSignature} = useEnforceSignature();

  const requestNewSettings = async (address, data) => {
    const { userInfo, userBanner, userAvatar } = data.userInfo;

    setResponse({
      ...response,
      loading: true,
      error: null,
    });

    try {
      const signature = await requestSignature();
      const cleanedInput = removeNullAndUndefinedFields(userInfo);
      const fetchResponse = await createProfile(cleanedInput, signature, address);

      if (userAvatar?.profilePicture[0]?.file?.name) {
        const formData = new FormData();
        formData.append('profilePicture', userAvatar?.profilePicture[0].file);
        await updateAvatar(formData, signature, address);
      }

      if (userBanner?.banner[0]?.file?.name) {
        const formData = new FormData();
        formData.append('banner', userBanner?.banner[0].file);
        await updateBanner(formData, signature, address);
      }

      setResponse({
        ...response,
        loading: false,
        error: null,
      });

      return fetchResponse.data;
    } catch (error) {
      setResponse({
        ...response,
        loading: false,
        error,
      });
      return { message: {error} }
    }
  };

  const removeNullAndUndefinedFields = (obj) => {
    return Object.entries(obj)
      .filter(([_, value]) => value !== null && value !== undefined)
      .reduce((newObj, [key, value]) => Object.assign(newObj, {[key]: value}), {});
  }

  return [requestNewSettings, response];
};

export default useCreateSettings;
