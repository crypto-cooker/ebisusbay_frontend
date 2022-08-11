import { editProfileFormFields } from './constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../../Form';

import Button from '@src/Components/components/common/Button';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCoffee, faSync} from "@fortawesome/free-solid-svg-icons";
import React from "react";

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
      <h2>Edit Profile</h2>
      <div className="d-flex flex-row mb-3">
        <div className="my-auto me-2">Sync profile information from Cronos Domain Service</div>
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
