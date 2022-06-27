import React from 'react';
import { Form } from 'react-bootstrap';

import { deepValidation } from '../../helpers/validator';
import UploadAssetPfp from './UploadAssetPfp';

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
    <Form.Group className={`form-field mb-3 ${error ? 'field-message-error' : ''}`}>
      <div className="upload-container">
        {[...Array(numberOfAssets).keys()].map((_, i) => {
          const asset = value.find(({ position }) => position === i);

          return (
            <UploadAssetPfp
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
      <Form.Text className="field-description text-muted">
        {error ? (typeof error === 'string' ? error : getErrorMessage(error[error.length - 1])) : description}
      </Form.Text>
    </Form.Group>
  );
};

export default React.memo(UploadPfp, deepValidation);
