import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

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
  const [{ response: settings }, updateProfileSettings] = useGetSettings(user?.address);
  const [isFetchCns, setIsFetchCns] = useState(false);
  const [mergedValues, setMergedValues] = useState(false);

  const getInitialValues = useCallback(() => {
    if (settings?.data) {
      let keys = editProfileFormFields[0].fields.map((field) => field.key);
      keys = [...keys, 'bio'];
      const filteredSettings = Object.keys(settings.data)
        .filter((key) => keys.includes(key))
        .reduce((obj, key) => {
          obj[key] = settings.data[key];
          return obj;
        }, {});

      const result = {
        userInfo: { userInfo: { ...filteredSettings }, userAvatar: { profilePicture: [{ result: settings.data.profilePicture, position: 0, file: { type: 'image' } }] }, userBanner: { banner: [{ result: settings.data.banner, position: 0, file: { type: 'image' } }] }, profilePictureUrl: settings.profilePicture, bannerUrl: settings.banner },
      };
      return result;
    }
    return { userInfo: { ...initialValues } };
  }, [settings]);

  const userInfoValidation = Yup.object().shape({
    userInfo: Yup.object({
      userInfo: Yup.object()
        .shape({
          username: Yup.string()
            .required(Messages.errors.required)
            .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40'])),
          cnsName: Yup.string()
            .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40'])),
          email: Yup.string().email(Messages.errors.invalidEmail).required(Messages.errors.required),
          twitter: Yup.string(),
          discord: Yup.string(),
          instagram: Yup.string(),
          website: Yup.string().url(Messages.errors.urlError),
          bio: Yup.string(),
        })
        .required(),
      userAvatar: Yup.object()
        .shape({
          profilePicture: Yup.array()
        }).required(),
      userBanner: Yup.object()
        .shape({
          banner: Yup.array()
        }).required(),
    })

  });

  const createFormData = (values) => {
    return Object.values(values).reduce((formData, formStep) => {
      Object.keys(formStep).forEach(key => {
        const isArray = typeof formStep[key] === 'object'
        if (isArray) {
          formStep[key].forEach((value) => {
            formData.append('images', value.file)
          })
        } else {
          formData.append(key, formStep[key])
        }
      });
      return formData;
    }, new FormData())
  };

  const handleCnsSync = async () => {
    setIsFetchCns(true);
    const cnsName = await getCnsName(user?.address); // Custom URL
    const cnsInfo = await getCnsInfo(user?.address);
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

  const onSubmit = async (values) => {
    try {

      const response = settings?.data?.walletAddress
        ? await requestUpdateSettings(values)
        : await requestNewSettings(values);
      if (!response || response?.message?.error) {
        toast.error('Something went wrong!');
      } else {
        toast.success('Your profile was saved successfully');
      }
      updateProfileSettings();

    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  };

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
    validationSchema: userInfoValidation,
    initialValues: getInitialValues(),
    enableReinitialize: true,
  });

  const validationForm = async (e) => {
    const errors = await validateForm(values);
    if (errors.userInfo) {
      const keysErrorsGroup = Object.keys(errors.userInfo);
      if (keysErrorsGroup.length > 0) {
        e.preventDefault();
        keysErrorsGroup.forEach(keyGroup => {

          const keysErrorsFields = Object.keys(errors.userInfo[keyGroup]);

          keysErrorsFields.forEach(keyField => {
            setFieldTouched(`userInfo.${keyGroup}.${keyField}`, true)
          });
        })
      }
    }
  }

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
            <Bio value={values?.userInfo?.userInfo?.bio} handleChange={handleChange} />
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
              isCnsSync={isFetchCns}
              handleCnsSync={handleCnsSync}
            />
          </div>
        </div>
      </form>
      <div className="d-flex justify-content-end mt-5">
        <button form="userSettings" type="submit" className="btn-main" onClick={validationForm}>
          {settings?.data?.walletAddress ? 'Update Profile' : 'Create Profile'}
          {(loading || updateLoading) && (
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
