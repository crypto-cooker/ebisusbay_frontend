import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '../../../components/Button';
import Messages, { getDynamicMessage } from '../../../../languages';
import { initialValues, editProfileFormFields } from './Form/constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../Form';

import Banner from './Banner';
import Bio from './Bio';
import Form from './Form';
import Pfp from './Pfp';

export default function EditProfile() {
  const [isOnSave, setIsOnSave] = useState(false);
  const [bio, setBio] = useState('');

  const handleBio = (e) => {
    setBio(e.target.value);
    console.log(e.target.value);
  };

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

  const onSubmit = useCallback(async (values) => {
    try {
      setIsOnSave(true);
      console.log(values);
      // const formData = createFormData({
      //   ...values,
      //   [editProfileFormFields[0].key]: {
      //     ...values[editProfileFormFields[0].key],
      //   },
      // });
      // console.log(formData);
      // const response = await requestNewCollection(formData);
      // if (!response || response?.message?.errors) {
      //   toast.error('Something went wrong!');
      // } else {
      //   toast.success('Your collection was saved successfully');
      // }
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
    setIsOnSave(false);
  }, []);

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleSubmit,
    validateForm,
  } = useFormik({
    onSubmit,
    validationSchema,
    initialValues,
  });
  return (
    <>
      <form id="userSettings" autoComplete="off" onSubmit={handleSubmit}>
        <div className="row mt-5">
          <div className="col-4">
            <Pfp
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
            <Banner
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
            <Bio text={bio} onChange={handleBio} />
          </div>
          <div className="col-8">
            <Form
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
          </div>
        </div>
      </form>
      <div className="d-flex justify-content-end mt-5">
        <button form="userSettings" type="submit" className="btn-main">
          Save Profile
        </button>
        {/* <Button type="legacy" onClick={onSubmit} isLoading={isOnSave}>
          Save Profile
        </Button> */}
      </div>
    </>
  );
}
