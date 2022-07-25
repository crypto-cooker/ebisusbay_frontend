import { editProfileFormFields } from './constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../../Form';
import Button from '@src/Components/components/common/Button';

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
}) {
  return (
    <div>
      <h2>Edit Profile</h2>
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
              {fieldKey === 'cnsName' && (
                <Button type="button" className="cns-sync-btn" onClick={handleCnsSync} isLoading={isCnsSync}>
                  Sync
                </Button>
              )}
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
