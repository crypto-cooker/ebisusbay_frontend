import { useSelector } from 'react-redux';
import { UploadFactionIcon } from '../../../Form'
import { editProfileFormFields } from '../Form/constants';
import { faC } from '@fortawesome/free-solid-svg-icons';

export default function FactionPfp({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur, faction, onSuccess }) {
  const user = useSelector((state) => state.user);

  return (
    <div className="d-flex justify-content-center position-relative mb-5">
      <div className="text-center">
        {editProfileFormFields[1].fields.map((field) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editProfileFormFields[1].key;
          const name = `userInfo.${subFormKey}.${[fieldKey]}`;
          props.name = faction.name;
          // props.key = `${type}-${fieldKey}`;
          // props.value = values.userInfo[subFormKey]?.[fieldKey];

          props.error = 
                touched.userInfo?.[subFormKey]?.[fieldKey] ? errors.userInfo?.[subFormKey]?.[fieldKey] : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'upload' ? (
            <UploadFactionIcon {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} faction={faction} onSuccess={onSuccess}/>
          ) : null;
        })}
      </div>
    </div>
  );
}
