import classnames from 'classnames';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExclamation } from '@fortawesome/free-solid-svg-icons';

import { UploadBanner } from '../../../../Form';
import { editProfileFormFields } from '../Form/constants';

import styles from './banner.module.scss';

export default function Banner({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {
  return (
    <div className={styles.banner}>
      <div className={classnames('d-flex align-items-center', styles.label)}>
        Banner
        {/* <FontAwesomeIcon icon={faExclamation} className="cursor-pointer ms-2" size="xs" /> */}
      </div>
      {editProfileFormFields[2].fields.map((field) => {
        const { type, ...props } = field;
        const fieldKey = props.key;
        const subFormKey = editProfileFormFields[2].key;
        const name = `userInfo.${subFormKey}.${[fieldKey]}`;
        props.name = name;
        props.key = `${type}-${fieldKey}`;
        props.value = values.userInfo[subFormKey][fieldKey];

        props.error = touched.userInfo?.[subFormKey]?.[fieldKey] ? errors.userInfo?.[subFormKey]?.[fieldKey] : undefined;

        if (props.inputType) props.type = props.inputType;

        return type === 'upload' ? (
          <UploadBanner {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
        ) : null;
      })}
      {/* <img src="/img/background/banner-dark.webp" width="100%" height="203" alt="Profile Banner" className="rounded" /> */}
    </div>
  );
}
