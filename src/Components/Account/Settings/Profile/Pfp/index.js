import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { UploadPfp } from '../../../../Form';
import { editProfileFormFields } from '../Form/constants';
import { shortAddress } from '../../../../../utils';

export default function Pfp({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {
  const user = useSelector((state) => state.user);
  const getUserName = (address) => {
    if (values?.userInfo?.userName) {
      return values?.userInfo?.userName;
    }
    if (address) {
      return shortAddress(address);
    }
  };

  const handleCopy = (code) => () => {
    navigator.clipboard.writeText(code);
    toast.success(values?.userInfo?.userName ? 'Username copied!' : 'Address copied!');
  };

  return (
    <div className="d-flex justify-content-center position-relative mb-5">
      <div className="text-center">
        {editProfileFormFields[1].fields.map((field) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editProfileFormFields[1].key;
          const name = `${subFormKey}.${[fieldKey]}`;
          props.name = name;
          props.key = `${type}-${fieldKey}`;
          props.value = values[subFormKey]?.[fieldKey];

          props.error = touched[subFormKey]?.[fieldKey] ? errors[subFormKey]?.[fieldKey] : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'upload' ? (
            <UploadPfp {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
          ) : null;
        })}
        <div className="mt-3">
          <span className="me-2">{getUserName(user?.address)}</span>
          <FontAwesomeIcon icon={faCopy} className="cursor-pointer" onClick={handleCopy(getUserName(user?.address))} />
        </div>
      </div>
    </div>
  );
}
