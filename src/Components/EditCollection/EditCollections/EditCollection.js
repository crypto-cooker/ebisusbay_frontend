import React, { useEffect, useState } from 'react'
import EditCollectionForm from "./EditCollectionForm";
import { initialValues as initialValuesDefault, editProfileFormFields } from './constants';
import Messages, { getDynamicMessage } from '../../../languages';
import * as Filter from 'bad-words';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCollections } from "@src/core/api/next/collectioninfo";
import useUpdate from '../hooks/useUpdate';
import { useQuery } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import Bio from './Bio';
import Banner from './Banner';
import Card from './Card';
import Pfp from './Pfp';

const EditCollection = ({ address: collectionAddress }) => {

  const [{ isLoading : isLoadingRequest, response, error }, update] = useUpdate();
  const user = useSelector((state) => state.user);

  const onSubmit = async () => {
    try {
      await update(user.address, values, collectionAddress);
      refetch(()=> getCollections({ address: collectionAddress }))
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  }

  const { data, status, isLoading, refetch } = useQuery(['Collections', collectionAddress], () =>
    getCollections({ address: collectionAddress }), true
  )

  const [initialValues, setInitialValues] = useState({ ...initialValuesDefault })

  useEffect(() => {
    if (!isLoading && data.data?.collections) {
      const { listable, slug,  name, metadata } = data.data.collections[0];
      setInitialValues({
        collectionInfo: {
          collectionName: name,
          listable: listable,
          twitter: metadata.twitter,
          discord: metadata.discord,
          website: metadata.website,
          collectionSlug: slug,
          description: metadata.description,
        },
        collectionAvatar: { collectionPicture: [{ result: metadata.avatar, position: 0, file: { type: 'image' } }] },
        collectionBanner: { banner: [{ result: metadata.banner, position: 0, file: { type: 'image' } }] },
        collectionCard: { card: [{ result: metadata.card, position: 0, file: { type: 'image' } }] }
      })
    }
  }, [data])

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
    collectionInfo: Yup.object()
      .shape({
        collectionName: Yup.string()
          .required(Messages.errors.required)
          .min(3, getDynamicMessage(Messages.errors.charactersMinLimit, ['3']))
          .max(50, getDynamicMessage(Messages.errors.charactersMaxLimit, ['50']))
          .isProfane('Invalid!')
          .matches(/^[a-zA-Z0-9-_.]+$/, Messages.errors.usernameFormat)
          .customUsernameRules('Invalid username'),
          collectionSlug: Yup.string()
          .required(Messages.errors.required)
          .min(3, getDynamicMessage(Messages.errors.charactersMinLimit, ['3']))
          .max(50, getDynamicMessage(Messages.errors.charactersMaxLimit, ['50']))
          .isProfane('Invalid!')
          .matches(/^[a-zA-Z0-9-_.]+$/, Messages.errors.usernameFormat)
          .trim()
          .customUsernameRules('Invalid username'),
        listable: Yup.boolean(),
        twitter: Yup.string()
          .required(Messages.errors.required)
          .trim(),
        discord: Yup.string().trim().required(Messages.errors.required),
        website: Yup.string().url(Messages.errors.urlError).required(Messages.errors.required),
        bio: Yup.string()
          .max(100, getDynamicMessage(Messages.errors.charactersMaxLimit, ['100']))
      })
      .required(),
    collectionAvatar: Yup.object()
      .shape({
        collectionPicture: Yup.array().of(
          Yup.object().shape({
            file: Yup.mixed().nullable().test('', 'Avatar must not exceed 1MB in size',
              (file) => file && file.size ? file.size <= 1000000 : true
            )
          })
        )
      }).required(),
    collectionBanner: Yup.object()
      .shape({
        banner: Yup.array().of(
          Yup.object().shape({
            size: Yup.object().nullable().test('', 'Banner must be at least 800 x 360 px',
              (size) => size ? size.width >= 800 && size.height >= 360 : true
            ),
            file: Yup.mixed().nullable().test('', 'Banner must not exceed 2MB in size',
              (file) => file && file.size ? file.size <= 2000000 : true
            )
          })
        )
      }).required(),
    collectionCard: Yup.object()
      .shape({
        card: Yup.array().of(
          Yup.object().shape({
            file: Yup.mixed().nullable().test('', 'Card must not exceed 1MB in size',
              (file) => file && file.size ? file.size <= 1000000 : true
            )
          })
        )
      }).required(),
  });

  const formikProps = useFormik({
    onSubmit,
    validationSchema: userInfoValidation,
    initialValues,
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
    resetForm
  } = formikProps;

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
            <Card
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
          </div>
          <div className="col-12 col-sm-12 col-lg-8">
            <EditCollectionForm
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              handleBlur={handleBlur}
            />
            <Bio value={values?.collectionInfo.description} handleChange={handleChange} error={errors?.collectionInfo?.description} />
          </div>
        </div>
      </form>
      <div className="d-flex justify-content-end mt-5">
        <button form="userSettings" type="submit" className="btn-main" onClick={handleSubmit}>
          Update Collection
          {(isLoadingRequest) && (
            <Spinner animation="border" role="status" size="sm" className="ms-1">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
        </button>
      </div>

    </>
  )
}

export default EditCollection;