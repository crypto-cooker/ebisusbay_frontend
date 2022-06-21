import { useSelector } from 'react-redux';
import Blockies from 'react-blockies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenSquare, faCopy } from '@fortawesome/free-solid-svg-icons';
import { UploadPfp } from '../../../../Form';
import { editProfileFormFields } from '../Form/constants';
import { shortAddress } from '../../../../../utils';

export default function Pfp({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {
  const user = useSelector((state) => state.user);
  const getUserName = (address) => {
    if (address) {
      return shortAddress(address);
    }
  };

  return (
    <div className="d-flex justify-content-center position-relative mb-5">
      <div className="text-center">
        {/* <div className="icon-edit position-absolute top-0 end-0">
          <FontAwesomeIcon icon={faPenSquare} className="cursor-pointer" />
        </div> */}
        {/* <Blockies seed={user?.address} size={25} scale={5} /> */}
        {editProfileFormFields[1].fields.map((field) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editProfileFormFields[0].key;
          const name = `${subFormKey}.${[fieldKey]}`;
          props.name = name;
          props.key = `${type}-${fieldKey}`;
          props.value = values[subFormKey][fieldKey];

          props.error = touched[subFormKey]?.[fieldKey] ? errors[subFormKey]?.[fieldKey] : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'field' ? (
            <Field {...props} onChange={handleChange} onBlur={handleBlur} />
          ) : type === 'radio' ? (
            <RadioGroup {...props} onChange={setFieldValue} />
          ) : type === 'upload' ? (
            <UploadPfp {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
          ) : null;
        })}
        <div className="mt-3">
          <span className="me-2">{getUserName(user?.address)}</span>
          <FontAwesomeIcon icon={faCopy} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
