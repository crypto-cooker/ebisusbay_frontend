import classnames from 'classnames';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faExclamation } from '@fortawesome/free-solid-svg-icons';

import { UploadBanner } from '../../../Form';
import { editCollectionFormFields } from '../constants';

import styles from './banner.module.scss';

export default function Card({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {
  return (
    <div className={styles.banner}>
      <div className={classnames('d-flex align-items-center', styles.label)}>
        Card
        {/* <FontAwesomeIcon icon={faExclamation} className="cursor-pointer ms-2" size="xs" /> */}
      </div>
      {editCollectionFormFields[3].fields.map((field) => {
        const { type, ...props } = field;
        const fieldKey = props.key;
        const subFormKey = editCollectionFormFields[3].key;
        const name = `${subFormKey}.${[fieldKey]}`;
        props.name = name;
        props.key = `${type}-${fieldKey}`;
        props.value = values?.[subFormKey]?.[fieldKey];

        props.error = touched?.[subFormKey]?.[fieldKey] ? errors?.[subFormKey]?.[fieldKey] : undefined;

        if (props.inputType) props.type = props.inputType;

        return type === 'upload' ? (
          <UploadBanner {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
        ) : null;
      })}
      {/* <img src="/img/background/banner-dark.webp" width="100%" height="203" alt="Profile Banner" className="rounded" /> */}
    </div>
  );
}
