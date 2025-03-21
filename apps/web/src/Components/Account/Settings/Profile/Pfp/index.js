import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { Stack, useDisclosure } from '@chakra-ui/react';

import { UploadPfp } from '../../../../Form';
import { editProfileFormFields } from '../Form/constants';
import { shortAddress } from '@market/helpers/utils';
import { useClipboard } from '@chakra-ui/react';
import { useUser } from '@src/components-v2/useUser';

import ProfilePicture from '../ProfilePicture';
import Modal from '@src/Components/components/chakra-components/Modal';

export default function Pfp({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {
  const user = useUser();
  const { onCopy } = useClipboard(user?.address);

  const {
    isOpen: isProfilePictureModalOpen,
    onOpen: onOpenProfilePictureModal,
    onClose: onCloseProfilePictureModal,
  } = useDisclosure();

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
    <>
      <div className="d-flex justify-content-center position-relative mb-5">
        <div className="text-center">
          {editProfileFormFields[1].fields.map((field) => {
            const { type, ...props } = field;
            const fieldKey = props.key;
            const subFormKey = editProfileFormFields[1].key;
            const name = `userInfo.${subFormKey}.${[fieldKey]}`;
            props.name = name;
            props.key = `${type}-${fieldKey}`;
            props.value = values.userInfo[subFormKey]?.[fieldKey];

            props.error = touched.userInfo?.[subFormKey]?.[fieldKey]
              ? errors.userInfo?.[subFormKey]?.[fieldKey]
              : undefined;

            if (props.inputType) props.type = props.inputType;

            return type === 'upload' ? (
              <UploadPfp
                {...props}
                fieldKey={fieldKey}
                onChange={setFieldValue}
                onTouched={setFieldTouched}
                onOpenPfpModal={onOpenProfilePictureModal}
              />
            ) : null;
          })}
          <div className="mt-3">
            <span className="me-2">{getUserName(user?.address)}</span>
            <FontAwesomeIcon icon={faCopy} className="cursor-pointer" onClick={handleCopy} />
          </div>
        </div>
      </div>

      <Modal
        title="Change Profile Picture"
        body={
          <ProfilePicture
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            onClose={onCloseProfilePictureModal}
          />
        }
        isOpen={isProfilePictureModalOpen}
        onClose={onCloseProfilePictureModal}
        dialogActions={<></>}
      />
    </>
  );
}
