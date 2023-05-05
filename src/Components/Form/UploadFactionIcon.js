import React from 'react';
import { Form } from 'react-bootstrap';
import axios from "axios";

import { deepValidation } from '../../helpers/validator';
import UploadAssetFactionIcon from './UploadAssetFactionIcon';
import { getAuthSignerInStorage } from '@src/helpers/storage';
import {useSelector} from "react-redux";
import { toast } from 'react-toastify';
import { createSuccessfulTransactionToastContent } from '@src/utils';

const UploadFactionIcon = ({
  value = [],
  numberOfAssets = 1,
  error,
  name,
  title,
  description,
  accept,
  isRequired,
  onChange,
  onTouched,
  faction,
  onSuccess
}) => {
  const user = useSelector((state) => state.user);

  const onUpload = (i) => (asset) => {
    const newAsset = { ...asset, position: i };
    const index = value.findIndex(({ position }) => position === i);

    const newData = index !== -1 ? value.map((data, j) => (index === j ? newAsset : data)) : [...value, newAsset];
    // console.log(newData);
    // console.log(faction);
    CallPatchFaction(newData, faction);
    onTouched(name);
  };

  const CallPatchFaction = async (newData, faction) => {
    let signatureInStorage = getAuthSignerInStorage()?.signature;
    if (!signatureInStorage) {
      const { signature } = await getSigner();
      signatureInStorage = signature;
    }
    if (signatureInStorage) {
      try {
        // console.log(faction.id, newData[0].result)
        const res = await UploadFactionIconPfp(user.address.toLowerCase(), signatureInStorage, 
          faction.name, Number(faction.id), newData[0].result);
        // console.log(res);
        onSuccess();

      } catch (error) {
        console.log(error)
        toast.error("Icon too large, please use a 250x250 image")
      }
    }
  }

  const api = axios.create({
    baseURL: 'api/',
  });

  const baseURL = 'https://testcms.ebisusbay.biz/';

  const UploadFactionIconPfp = async (address, signature, name, id, image) => {
    try{
      // console.log(address, signature, name, image);
      return await api.patch(baseURL + "api/ryoshi-dynasties/factions?", 
        {name, id, image},
        {params: {address, signature}});
    }
    catch(error){
      throw error;
    }
  }

  const onClean = (i) => () => {
    onChange(
      name,
      value.filter(({ position }) => position !== i)
    );
    onTouched(name);
  };

  const getErrorMessage = (error) => {
    const [key] = Object.keys(error);
    return error[key];
  };

  return (
    <Form.Group className={`form-field  ${error ? 'field-message-error' : ''}`}>
      <div className="upload-container overflow-auto justify-content-center">
        {[...Array(numberOfAssets).keys()].map((_, i) => {
          const asset = value.find(({ position }) => position === i);

          return (
            <UploadAssetFactionIcon
              key={`${name}-${i}`}
              id={`${name}-${i}`}
              accept={accept}
              value={asset}
              url={value?.[0]?.url}
              onClose={asset?.result ? onClean(i) : undefined}
              onChange={onUpload(i)}
              faction={faction}
            />
          );
        })}
      </div>
      {/* <Form.Text className="field-description text-muted">
        {error ? (typeof error === 'string' ? error : getErrorMessage(error[error.length - 1])) : description}
      </Form.Text> */}
    </Form.Group>
  );
};

export default React.memo(UploadFactionIcon, deepValidation);
