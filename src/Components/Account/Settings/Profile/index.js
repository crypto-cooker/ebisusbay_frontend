import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

import Button from '../../../components/Button';
import Messages, { getDynamicMessage } from '../../../../languages';
import { initialValues, editProfileFormFields } from './Form/constants';
import useCreateSettings from '../hooks/useCreateSettings';
import useUpdateSettings from '../hooks/useUpdateSettings';

import Banner from './Banner';
import Bio from './Bio';
import Form from './Form';
import Pfp from './Pfp';
import useGetSettings from '../hooks/useGetSettings';
import { getCnsInfo, getCnsName } from '@src/helpers/cns';

export default function EditProfile() {
  const user = useSelector((state) => state.user);
  const [requestNewSettings, { loading }] = useCreateSettings();
  const [requestUpdateSettings, { loading: updateLoading }] = useUpdateSettings();
  const { response: settings } = useGetSettings();
  const [isFetchCns, setIsFetchCns] = useState(false);
  const [mergedValues, setMergedValues] = useState(false);

  const getInitialValues = () => {
    if (settings) {
      let keys = editProfileFormFields[0].fields.map((field) => field.key);
      keys = [...keys, 'bio'];

      const filteredSettings = Object.keys(settings)
        .filter((key) => keys.includes(key))
        .reduce((obj, key) => {
          obj[key] = settings[key];
          return obj;
        }, {});

      const result = {
        userInfo: { ...filteredSettings, profilePictureUrl: settings.profilePicture, bannerUrl: settings.banner },
      };
      return result;
    }
    return initialValues;
  };

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
        if (key !== 'profilePictureUrl' && key !== 'bannerUrl') {
          const isArray = typeof formStep[key] === 'object';

          if (isArray) {
            formData.append(key, formStep[key]?.[0].file);
          } else {
            formData.append(key, formStep[key]);
          }
        }
      });

      return formData;
    }, new FormData());
  };

  const handleCnsSync = async () => {
    setIsFetchCns(true);
    const cnsName = await getCnsName(user?.address); // Custom URL
    const cnsInfo = await getCnsInfo(user?.address);
    // console.log('getCnsName', cnsName);
    // console.log('getCnsInfo', cnsInfo);
    const userInfo = values?.userInfo;
    const tempData = {
      userInfo: {
        ...userInfo,
        cnsName,
        twitter: cnsInfo?.twitter || userInfo?.twitter,
        discord: cnsInfo?.discord || userInfo?.discord,
        instagram: cnsInfo?.instagram || userInfo?.instagram,
        website: cnsInfo?.url || userInfo?.website,
        email: cnsInfo?.email || userInfo?.email,
      },
    };
    setMergedValues(tempData);
    setIsFetchCns(false);
  };

  const onSubmit = useCallback(async (values) => {
    try {
      const formData = createFormData({
        ...values,
        [editProfileFormFields[0].key]: {
          ...values[editProfileFormFields[0].key],
          walletAddress: user?.address,
        },
      });

      const response = settings?.walletAddress
        ? await requestUpdateSettings(formData)
        : await requestNewSettings(formData);
      if (!response || response?.message?.errors) {
        toast.error('OnSubmit: Something went wrong!');
      } else {
        toast.success('Your collection was saved successfully');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
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
    enableReinitialize: true,
  });

  useEffect(() => {
    setMergedValues(values);
  }, [values]);

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
            <Banner
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
            <Bio value={values?.userInfo?.bio} handleChange={handleChange} />
          </div>
          <div className="col-12 col-sm-12 col-lg-8">
            <Form
              values={mergedValues}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
              isCnsSync={isFetchCns}
              handleCnsSync={handleCnsSync}
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
        {/* TODO: update button component
        <Button type="legacy" onClick={onSubmit} isLoading={isOnSave}>
          Save Profile
        </Button> */}
      </div>
    </>
  );
}
