import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '../../../../components/Button';
import Messages, { getDynamicMessage } from '../../../../../languages';
import { initialValues, editProfileFormFields } from './constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../../Form';

export default function Form({ values, errors, touched, handleChange, setFieldValue, setFieldTouched, handleBlur }) {
  const [isOnSave, setIsOnSave] = useState(false);

  const userInfoValidation = Yup.object().shape({
    userInfo: Yup.object()
      .shape({
        username: Yup.string()
          .required(Messages.errors.required)
          .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40'])),
        customUrl: Yup.string()
          .required(Messages.errors.required)
          .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40'])),
        email: Yup.string().email(Messages.errors.invalidEmail).required(Messages.errors.required),
        twitterHandle: Yup.string().required(Messages.errors.required),
        discordId: Yup.string().required(Messages.errors.required),
        instagramHandle: Yup.string().required(Messages.errors.required),
        website: Yup.string().url(Messages.errors.urlError).required(Messages.errors.required),
      })
      .required(),
  });

  const validationSchema = Yup.object().shape({}).concat(userInfoValidation);

  const createFormData = (values) => {
    return Object.values(values).reduce((formData, formStep) => {
      Object.keys(formStep).forEach((key) => {
        const isArray = typeof formStep[key] === 'object';

        if (isArray) {
          formStep[key].forEach((value) => {
            formData.append(key, value);
          });
        } else {
          formData.append(key, formStep[key]);
        }
      });

      return formData;
    }, new FormData());
  };

  // const onSubmit = useCallback(async (values) => {
  //   try {
  //     setIsOnSave(true);
  //     console.log(values);
  //     // const formData = createFormData({
  //     //   ...values,
  //     //   [editProfileFormFields[0].key]: {
  //     //     ...values[editProfileFormFields[0].key],
  //     //   },
  //     // });
  //     // console.log(formData);
  //     // const response = await requestNewCollection(formData);
  //     // if (!response || response?.message?.errors) {
  //     //   toast.error('Something went wrong!');
  //     // } else {
  //     //   toast.success('Your collection was saved successfully');
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error('Error');
  //   }
  //   setIsOnSave(false);
  // }, []);

  // const {
  //   values,
  //   errors,
  //   touched,
  //   handleChange,
  //   setFieldValue,
  //   setFieldTouched,
  //   handleBlur,
  //   handleSubmit,
  //   validateForm,
  // } = useFormik({
  //   onSubmit,
  //   validationSchema,
  //   initialValues,
  // });

  return (
    <div>
      <h2>Edit Profile</h2>

      <div>
        {/* <form id="userSettings" autoComplete="off" onSubmit={handleSubmit}> */}
        {editProfileFormFields[0].fields.map((field) => {
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
            <UploadAssetGroup {...props} fieldKey={fieldKey} onChange={setFieldValue} onTouched={setFieldTouched} />
          ) : null;
        })}
      </div>
    </div>
  );
}
