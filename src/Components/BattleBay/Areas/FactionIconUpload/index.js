import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadFactionIcon } from '../../../Form'
import { editProfileFormFields } from '../Form/constants';
import {useClipboard} from "@chakra-ui/react";
import { shortAddress } from '@src/utils';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export default function FactionPfp({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur, faction, onSuccess }) {
  const user = useSelector((state) => state.user);
  const { onCopy } = useClipboard(user?.address);

  const getUserName = (address) => {
    if (values?.userInfo?.username) {
      return values?.userInfo?.username;
    }
    if (address) {
      return shortAddress(address);
    }
  };
  const handleCopy = () => {
    onCopy();
    toast.success('Address copied!');
  };

  return (
    <div className="d-flex justify-content-center position-relative ">
      <div className="text-center">
        {editProfileFormFields[1].fields.map((field) => {
          const { type, ...props } = field;
          const fieldKey = props.key;
          const subFormKey = editProfileFormFields[1].key;
          const name = `userInfo.${subFormKey}.${[fieldKey]}`;
          props.name = faction.name;
          props.key = `${type}-${fieldKey}`;
          // props.value = values.userInfo[subFormKey]?.[fieldKey];

          props.error = 
                touched.userInfo?.[subFormKey]?.[fieldKey] ? errors.userInfo?.[subFormKey]?.[fieldKey] : undefined;

          if (props.inputType) props.type = props.inputType;

          return type === 'upload' ? (
            <UploadFactionIcon {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} faction={faction} onSuccess={onSuccess}/>
          ) : null;
        })}
        {/* <div className="mt-3">
          <span className="me-2">{getUserName(user?.address)}</span>
          <FontAwesomeIcon icon={faCopy} className="cursor-pointer" onClick={handleCopy} />
        </div> */}
      </div>
    </div>
  );
}
