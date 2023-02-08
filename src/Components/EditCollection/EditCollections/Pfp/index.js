import { UploadPfp } from '../../../Form';
import { editCollectionFormFields } from '../constants';

export default function Pfp({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {

  return (
    <div className="d-flex justify-content-center position-relative mb-5">
      <div className="text-center">
        {editCollectionFormFields[1].fields.map((field) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editCollectionFormFields[1].key;
          const name = `${subFormKey}.${[fieldKey]}`;
          props.name = name;
          props.key = `${type}-${fieldKey}`;
          props.value = values[subFormKey]?.[fieldKey];
          props.error = 
                touched[subFormKey]?.[fieldKey] ? errors[subFormKey]?.[fieldKey] : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'upload' ? (
            <UploadPfp {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
          ) : null;
        })}
      </div>
    </div>
  );
}
