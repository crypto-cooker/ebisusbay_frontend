import { editCollectionFormFields } from './constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../Components/Form';

import React from "react";

export default function EditCollectionForm({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  setFieldTouched,
  handleBlur,
}) {
  return (
    <div>
      <h2>Edit Collection</h2>
      <div>
        {editCollectionFormFields[0].fields.map((field, index) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const name = `collectionInfo.${[fieldKey]}`;
          props.name = name;
          props.key = `${type}-${fieldKey}`;
          props.value = values.collectionInfo?.[fieldKey];
          props.error =
            touched.collectionInfo?.[fieldKey]
              ? errors.collectionInfo?.[fieldKey]
              : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'field' ? (
            <div className="user-profile-form-field" key={index}>
              <Field {...props} onChange={handleChange} onBlur={handleBlur} />
            </div>
          ) : type === 'radio' ? (
            <RadioGroup {...props} onChange={setFieldValue} />
          ) : type === 'upload' ? (
            <UploadAssetGroup {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
          ) : null;
        })}
      </div>
    </div>
  );
}
