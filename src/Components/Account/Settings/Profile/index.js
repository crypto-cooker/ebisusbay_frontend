import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
import * as Filter from 'bad-words';

import Messages, {getDynamicMessage} from '../../../../modules/market/languages';
import {editProfileFormFields, initialValues} from './Form/constants';
import useCreateSettings from '../hooks/useCreateSettings';
import useUpdateSettings from '../hooks/useUpdateSettings';
import useResendEmailVerification from '../hooks/useResendEmailVerification'

import Banner from './Banner';
import Bio from '@src/components-v2/feature/account/settings/fields/bio';
import Form from './Form';
import Pfp from './Pfp';
import useGetSettings from '../hooks/useGetSettings';
import {Flex} from "@chakra-ui/react";
import {PrimaryButton} from "@src/components-v2/foundation/button";
import {parseErrorMessage} from "@src/helpers/validator";
import {getCroidInfo} from "@market/helpers/croid";
import {useUser} from "@src/components-v2/useUser";

export default function EditProfile() {
  const user = useUser();
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
            .max(50, getDynamicMessage(Messages.errors.charactersMaxLimit, ['50']))
            .isProfane('Invalid!')
            .matches(/^[a-zA-Z0-9-_.]+$/, Messages.errors.usernameFormat)
            .customUsernameRules('Invalid username'),
          email: Yup.string().email(Messages.errors.invalidEmail).nullable(),
          twitter: Yup.string()
            .trim()
            .nullable()
            .min(4)
            .max(15)
            .matches(/^[a-zA-Z0-9_.]+$/, 'Invalid Twitter username'),
          discord: Yup.string().trim().nullable(),
          instagram: Yup.string()
            .trim()
            .nullable()
            .min(3)
            .max(30)
            .matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, 'Invalid Instagram username'),
          website: Yup.string().url(Messages.errors.urlError).nullable(),
          bio: Yup.string()
              .max(100, getDynamicMessage(Messages.errors.charactersMaxLimit, ['100']))
        })
        .required(),
      userAvatar: Yup.object()
        .shape({
          profilePicture: Yup.array().of(
            Yup.object().shape({
              file: Yup.mixed().nullable().test('', 'Avatar must not exceed 1MB in size',
                (file) => file && file.size? file.size <= 1000000 : true
              )
            })
          )
        }).required(),
      userBanner: Yup.object()
        .shape({
          banner: Yup.array().of(
            Yup.object().shape({
              size: Yup.object().nullable().test('', 'Banner must be at least 800 x 360 px',
                (size) => size ? size.width >= 800 && size.height >= 360 : true
              ),
              file: Yup.mixed().nullable().test('', 'Banner must not exceed 2MB in size',
                (file) => file && file.size? file.size <= 2000000 : true
              )
            })
          )
        }).required(),
    })

  });

  const handleCnsSync = async () => {
    try {
      setIsFetchCns(true);
      const cnsInfo = await getCroidInfo(user?.address);
      if (!cnsInfo) {
        toast.error('No CID found');
        return;
      }
      if (!cnsInfo.name) {
        toast.error('No domain found. Make sure to claim and set a default domain on Cronos ID');
        return;
      }


      const userInfo = values?.userInfo;
      const tempData = {
        userInfo: {
          username: cnsInfo?.name || userInfo?.userInfo?.username,
          twitter: cnsInfo?.twitter || userInfo?.userInfo?.twitter,
          discord: cnsInfo?.discord || userInfo?.userInfo?.discord,
          instagram: cnsInfo?.instagram || userInfo?.userInfo?.instagram,
          website: cnsInfo?.url || userInfo?.userInfo?.website,
          email: cnsInfo?.email || userInfo?.userInfo?.email,
          bio: cnsInfo?.description || userInfo?.userInfo?.bio,
        },
      };
      setMergedValues(tempData);
    } finally {
      setIsFetchCns(false);
    }
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
        ? await requestUpdateSettings(user.address, values)
        : await requestNewSettings(user.address, values);
      if (response?.message?.error) {
        toast.error(parseErrorMessage(response.message.error));
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

  const createNewEmailVerification = async (e) => {
    e.preventDefault();

    try {

      const response = await requestResendEmailVerification(user.address);

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
            <Bio value={values?.userInfo?.userInfo?.bio} handleChange={handleChange} error={errors.userInfo?.userInfo?.bio} />
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
      <Flex justify='end' mt={5}>
        <PrimaryButton
          form='userSettings'
          type='submit'
          onClick={validationForm}
          isLoading={(loading || updateLoading)}
        >
          {settings?.data?.walletAddress ? 'Update Profile' : 'Create Profile'}
        </PrimaryButton>
      </Flex>
    </>
  );
}
