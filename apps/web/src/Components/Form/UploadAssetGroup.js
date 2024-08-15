import React from 'react';

import { deepValidation } from '@src/helpers/validator';

import UploadAsset from './UploadAsset';
import {FormControl, FormErrorMessage, FormLabel} from "@chakra-ui/react";

const UploadAssetGroup = ({
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
    <FormControl className={`form-field mb-3 ${error ? 'field-message-error' : ''}`} isInvalid={!!error}>
      <div className="label-container">
        <FormLabel className="title">{title}</FormLabel>
        {isRequired ? <FormLabel className="required-label">*Required</FormLabel> : <FormLabel>Optional</FormLabel>}
      </div>
      <div className="upload-container">
        {[...Array(numberOfAssets).keys()].map((_, i) => {
          const asset = value.find(({ position }) => position === i);

          return (
            <UploadAsset
              key={`${name}-${i}`}
              id={`${name}-${i}`}
              accept={accept}
              value={asset}
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

export default React.memo(UploadAssetGroup, deepValidation);
