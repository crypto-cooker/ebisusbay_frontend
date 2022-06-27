import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import Button from '../../../components/Button';
import Messages, { getDynamicMessage } from '../../../../languages';
import { initialValues, editProfileFormFields } from './Form/constants';
import { Field, RadioGroup, UploadAssetGroup } from '../../../Form';
import useCreateSettings from '../hooks/useCreateSettings';
import { Spinner } from 'react-bootstrap';

import Banner from './Banner';
import Bio from './Bio';
import Form from './Form';
import Pfp from './Pfp';
import useGetSettings from '../hooks/useGetSettings';

export default function EditProfile() {
  const [isOnSave, setIsOnSave] = useState(false);
  const user = useSelector((state) => state.user);
  // const [bio, setBio] = useState('');
  const [requestNewSettings, { loading }] = useCreateSettings();
  const { response: settings } = useGetSettings();

  const getInitialValues = () => {
    if (settings) {
      let keys = editProfileFormFields[0].fields.map((field) => field.key);
      keys = [...keys, 'profilePicture', 'bio'];

      const filteredSettings = Object.keys(settings)
        .filter((key) => keys.includes(key))
        .reduce((obj, key) => {
          obj[key] = settings[key];
          return obj;
        }, {});

      console.log({ userInfo: filteredSettings });
      return { userInfo: filteredSettings };
    }
    return initialValues;
  };
  console.log(getInitialValues());
  // const handleBio = (e) => {
  //   setBio(e.target.value);
  //   console.log(e.target.value);
  // };

  const userInfoValidation = Yup.object().shape({
    userInfo: Yup.object()
      .shape({
        userName: Yup.string()
          .required(Messages.errors.required)
          .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40'])),
        cnsName: Yup.string()
          .required(Messages.errors.required)
          .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40'])),
        email: Yup.string().email(Messages.errors.invalidEmail).required(Messages.errors.required),
        twitter: Yup.string().required(Messages.errors.required),
        discord: Yup.string().required(Messages.errors.required),
        instagram: Yup.string().required(Messages.errors.required),
        website: Yup.string().url(Messages.errors.urlError).required(Messages.errors.required),
        bio: Yup.string().required(Messages.errors.required),
      })
      .required(),
  });

  const validationSchema = Yup.object().shape({}).concat(userInfoValidation);

  const createFormData = (values) => {
    return Object.values(values).reduce((formData, formStep) => {
      Object.keys(formStep).forEach((key) => {
        const isArray = typeof formStep[key] === 'object';

        if (isArray) {
          // formStep[key].forEach((value) => {
          //   console.log(value)
          //   formData.append(key, value);
          // });
          // console.log(formStep[key][0])
          formData.append(key, formStep[key][0].file);
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

      const formData = createFormData({
        ...values,
        [editProfileFormFields[0].key]: {
          ...values[editProfileFormFields[0].key],
          walletAddress: user?.address,
        },
      });

      const response = await requestNewSettings(formData);
      if (!response || response?.message?.errors) {
        toast.error('Something went wrong!');
      } else {
        toast.success('Your collection was saved successfully');
      }
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
    initialValues: getInitialValues(),
  });
  return (
    <>
      <form id="userSettings" autoComplete="off" onSubmit={handleSubmit} className="user-settings-form">
        <div className="row mt-5">
          <div className="col-12 col-sm-12 col-lg-4">
            <Pfp
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
            {/* <Banner
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            /> */}
            <Bio values={values?.userInfo?.bio} handleChange={handleChange} />
          </div>
          <div className="col-12 col-sm-12 col-lg-8">
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
          Save Profile{' '}
          {loading && (
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </button>
        {/* <Button type="legacy" onClick={onSubmit} isLoading={isOnSave}>
          Save Profile
        </Button> */}
      </div>
    </>
  );
}
