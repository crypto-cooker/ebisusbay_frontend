import { editProfileFormFields } from './constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../../Form';
import Button from '@src/Components/components/Button';

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
        {editProfileFormFields[0].fields.map((field) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editProfileFormFields[0].key;
          const name = `${subFormKey}.${[fieldKey]}`;
          props.name = name;
          props.key = `${type}-${fieldKey}`;
          props.value = values[subFormKey]?.[fieldKey];

          props.error = touched[subFormKey]?.[fieldKey] ? errors[subFormKey]?.[fieldKey] : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'field' ? (
            <div className="user-profile-form-field">
              <Field {...props} onChange={handleChange} onBlur={handleBlur} />
              {fieldKey === 'cnsName' && (
                <Button type="legacy" className="cns-sync-btn" onClick={handleCnsSync} isLoading={isCnsSync}>
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
