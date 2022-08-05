import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import * as Filter from 'bad-words';

import Messages, { getDynamicMessage } from '../../../../languages';
import { initialValues, editProfileFormFields } from './Form/constants';
import useCreateSettings from '../hooks/useCreateSettings';
import useUpdateSettings from '../hooks/useUpdateSettings';
import useResendEmailVerification from '../hooks/useResendEmailVerification'

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
  const [requestResendEmailVerification, { loading: resendLoading }] = useResendEmailVerification();
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

  Yup.addMethod(Yup.string, "isProfane", function (errorMessage) {
    return this.test(`isProfane`, errorMessage, function (value) {
      const filter = new Filter();
      return !filter.isProfane(value);
    });
  });

  Yup.addMethod(Yup.string, "customUsernameRules", function (errorMessage) {
    return this.test(`customUsernameRules`, errorMessage, function (value) {
      if (!value) return false;

      if (value.includes('.')) {
        return value.endsWith('.cro');
      }

      if (value.startsWith('-') ||
          value.startsWith('_') ||
          value.startsWith('.')
      ) return false;

      return true;
    });
  });

  const userInfoValidation = Yup.object().shape({
    userInfo: Yup.object({
      userInfo: Yup.object()
        .shape({
          username: Yup.string()
            .required(Messages.errors.required)
            .min(3, getDynamicMessage(Messages.errors.charactersMinLimit, ['3']))
            .max(40, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40']))
            .isProfane('Invalid!')
            .matches(/^[a-zA-Z0-9-_.]+$/, Messages.errors.usernameFormat)
            .customUsernameRules('Invalid username'),
          email: Yup.string().email(Messages.errors.invalidEmail).required(Messages.errors.required),
          twitter: Yup.string().trim().nullable(),
          discord: Yup.string().trim().nullable(),
          instagram: Yup.string().trim().nullable(),
          website: Yup.string().url(Messages.errors.urlError),
          bio: Yup.string()
              .max(100, getDynamicMessage(Messages.errors.charactersMaxLimit, ['40']))
        })
        .required(),
      userAvatar: Yup.object()
        .shape({
          profilePicture: Yup.array().of(
            Yup.object().shape({
              size: Yup.object().nullable().test('', 'Sorry, this picture exceeds the maximum file size or dimensions, please check and try again.',
                (size) => size ? size.width <= 350 && size.height <= 350 : true
              ),
              file: Yup.mixed().nullable().test('', 'Sorry, this picture exceeds the maximum file size or dimensions, please check and try again.',
                (file) => file && file.size? file.size <= 1000000 : true)
            })
          )
        }).required(),
      userBanner: Yup.object()
        .shape({
          banner: Yup.array().of(
            Yup.object().shape({
              size: Yup.object().nullable().test('', 'Sorry, this picture exceeds the maximum file size or dimensions, please check and try again.',
                (size) => size ? size.width === 1920 && size.height === 1080 : true
              ),
              file: Yup.mixed().nullable().test('', 'Sorry, this picture exceeds the maximum file size or dimensions, please check and try again.',
                (file) => file && file.size? file.size <= 2000000 : true)
            })
          )
        }).required(),
    })

  });

  const handleCnsSync = async () => {
    setIsFetchCns(true);
    const cnsName = await getCnsName(user?.address); // Custom URL
    const cnsInfo = await getCnsInfo(user?.address);
    const userInfo = values?.userInfo;
    const tempData = {
      userInfo: {
        username: cnsName,
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

  useEffect(() => {
    if (!mergedValues) return;

    for(const [key, value] of Object.entries(mergedValues.userInfo)) {
      formikProps.setFieldValue(`userInfo.userInfo.${key}`, value);
    }
  }, [mergedValues]);

  const onSubmit = async (values) => {
    try {

      const response = settings?.data?.walletAddress
        ? await requestUpdateSettings(values)
        : await requestNewSettings(values);
      if (!response || response?.message?.error) {
        toast.error('Something went wrong!');
      } else {
        toast.success('Your profile was saved successfully');
        updateProfileSettings();
      }

    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  };

  const formikProps = useFormik({
    onSubmit,
    validationSchema: userInfoValidation,
    initialValues: getInitialValues(),
    enableReinitialize: true,
  });
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
  } = formikProps;

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

  const createNewEmailVerification = (e) => {
    e.preventDefault();

    try {

      const response = requestResendEmailVerification();

      if (!response || response?.message?.error) {
        toast.error('Something went wrong!');
      } else {
        toast.success('Verification forwarded');
      }

    } catch (error) {
      console.log(error);
      toast.error('Error');
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
              settingsData={settings?.data}
              resendEmail={createNewEmailVerification}
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
      </div>
    </>
  );
}
