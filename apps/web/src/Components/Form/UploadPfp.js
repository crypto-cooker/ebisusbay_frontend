import React from 'react';

import { deepValidation } from '../../helpers/validator';
import UploadAssetPfp from './UploadAssetPfp';
import {FormControl, FormErrorMessage} from "@chakra-ui/react";

const UploadPfp = ({
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
}) => {
  const onUpload = (i) => (asset) => {
    const newAsset = { ...asset, position: i };
    const index = value.findIndex(({ position }) => position === i);

    const newData = index !== -1 ? value.map((data, j) => (index === j ? newAsset : data)) : [...value, newAsset];

    onChange(name, newData);
    onTouched(name);
  };

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
    <FormControl className={`form-field mb-3 ${error ? 'field-message-error' : ''}`} invalid={!!error}>
      <div className="upload-container overflow-auto justify-content-center">
        {[...Array(numberOfAssets).keys()].map((_, i) => {
          const asset = value.find(({ position }) => position === i);
          
          return (
            <UploadAssetPfp
              key={`${name}-${i}`}
              id={`${name}-${i}`}
              accept={accept}
              value={asset}
              url={value?.[0]?.url}
              onClose={asset?.result ? onClean(i) : undefined}
              onChange={onUpload(i)}
            />
          );
        })}
      </div>
      <FormErrorMessage className="field-description text-muted">
        {error ? (typeof error === 'string' ? error : getErrorMessage(error[error.length - 1])) : description}
      </FormErrorMessage>
    </FormControl>
  );
};

export default React.memo(UploadPfp, deepValidation);
