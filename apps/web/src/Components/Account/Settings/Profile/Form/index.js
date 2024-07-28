import {editProfileFormFields} from './constants';
import {Field, RadioGroup, UploadAssetGroup} from '../../../../Form';

import Button from '@src/Components/components/common/Button';
import React from "react";
import {Heading} from "@chakra-ui/react";

export default function Form({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  setFieldTouched,
  handleBlur,
  isCnsSync = false,
  handleCnsSync,
  settingsData,
  resendEmail
}) {
  return (
    <div>
      <Heading as="h2" size="xl">Edit Profile</Heading>
      <div className="d-flex flex-row mb-3">
        <div className="my-auto me-2">Sync profile information from Cronos ID</div>
        <Button type="button" className="px-3 py-1 my-auto" onClick={handleCnsSync} isLoading={isCnsSync}>
          Sync
        </Button>
      </div>
      <div>
        {editProfileFormFields[0].fields.map((field, index) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editProfileFormFields[0].key;
          const name = `userInfo.${subFormKey}.${[fieldKey]}`;
          props.name = name;
          props.key = `${type}-${fieldKey}`;
          props.value = values.userInfo?.[subFormKey]?.[fieldKey];
          props.error =
            touched.userInfo?.[subFormKey]?.[fieldKey]
              ? errors.userInfo?.[subFormKey]?.[fieldKey]
              : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'field' ? (
            <div className="user-profile-form-field" key={index}>
              <Field {...props} onChange={handleChange} onBlur={handleBlur} />
              {fieldKey === 'email' && settingsData?.email && !(settingsData?.isEmailVerified) &&
                <div className='mb-5'>
                  <a className="link-text-form link-primary " onClick={resendEmail}>
                    Resend verification email
                  </a>
                </div>
              }
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
