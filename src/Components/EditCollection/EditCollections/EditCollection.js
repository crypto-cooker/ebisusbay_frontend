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
import Bio from '@src/components-v2/feature/account/collections/fields/bio';
import Banner from './Banner';
import Card from './Card';
import Pfp from './Pfp';
import * as DOMPurify from 'dompurify';
import CustomizedDialogs from '../Dialog';
import {Spinner} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";

const EditCollection = ({ address: collectionAddress }) => {

  const [{ isLoading: isLoadingRequest, response, error }, update] = useUpdate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useUser();

  const onSubmit = async () => {
    try {
      await update(user.address, values, collectionAddress);
      setIsOpen(false);
      refetch(() => getCollections({ address: collectionAddress }))
      resetForm();
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  }

  const { data, status, isPending, refetch } = useQuery({
    queryKey: ['Collections', collectionAddress],
    queryFn: () => getCollections({address: collectionAddress})
  })

  const [initialValues, setInitialValues] = useState({ ...initialValuesDefault })

  useEffect(() => {
    if (!isPending && data.data?.collections) {
      const { listable, slug, name, metadata } = data.data.collections[0];
      setInitialValues({
        collectionInfo: {
          collectionName: name,
          listable: listable,
          twitter: metadata.twitter? metadata.twitter : '',
          discord: metadata.discord? metadata.discord : '',
          website: metadata.website? metadata.website : '',
          collectionSlug: slug,
          description: metadata.description? metadata.description : '',
          instagram: metadata.instagram? metadata.instagram : '',
          telegram: metadata.telegram? metadata.telegram : '',
          medium: metadata.medium? metadata.medium : '',
          documentation: metadata.medium? metadata.documentation : ''
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

  useEffect(() => {
    if (!isLoadingRequest) {
      if (error) {
        toast.error('Something went wrong!');
      } else if (response) {
        toast.success('It was updated successfully');
        refetch(() => getOwnerCollections(user.address));
      }
    }
  }, [isLoadingRequest, response, error])

  const userInfoValidation = Yup.object().shape({
    collectionInfo: Yup.object()
      .shape({
        collectionName: Yup.string()
          .required(Messages.errors.required)
          .min(3, getDynamicMessage(Messages.errors.charactersMinLimit, ['3']))
          .max(50, getDynamicMessage(Messages.errors.charactersMaxLimit, ['50']))
          .isProfane('Invalid!')
          .matches(/^[a-zA-Z0-9-_.\s]+$/, Messages.errors.usernameFormat)
          .test('max one space between chars', 'max one space between chars', val => {
            for(let i = 1; i < val.length; i++){
              if(val[i - 1] ===  ' ' && val[i] === ' '){
                return false
              }
            }
            return true;
          }),
        collectionSlug: Yup.string()
          .required(Messages.errors.required)
          .min(3, getDynamicMessage(Messages.errors.charactersMinLimit, ['3']))
          .max(50, getDynamicMessage(Messages.errors.charactersMaxLimit, ['50']))
          .isProfane('Invalid!')
          .matches(/^[a-zA-Z0-9-_.]+$/, Messages.errors.usernameFormat)
          .trim()
          .test('max one space between dash', 'max one space between dash', val => {
            for(let i = 1; i < val.length; i++){
              if(val[i - 1] ===  '-' && val[i] === '-'){
                return false
              }
            }
            return true;
          }),
        listable: Yup.boolean(),
        twitter: Yup.string()
          .trim()
          .nullable()
          .min(4, getDynamicMessage(Messages.errors.charactersMinLimit, ['4']))
          .max(15, getDynamicMessage(Messages.errors.charactersMaxLimit, ['15']))
          .matches(/^[a-zA-Z0-9_.]+$/, 'Invalid Twitter'),
        discord: Yup.string().trim()
        .nullable()
        .matches(/^[a-zA-Z0-9_.]+$/, 'Invalid Discord'),
        telegram: Yup.string().trim()
        .nullable(),
        instagram: Yup.string().trim()
          .nullable()
          .matches(/^[a-zA-Z0-9_.]+$/, 'Invalid Instagram'),
        medium: Yup.string().trim()
          .nullable()
          .matches(/^[a-zA-Z0-9_.]+$/, 'Invalid medium'),
        documentation: Yup.string().trim()
          .nullable()
          .url(Messages.errors.urlError),
        website: Yup.string().url(Messages.errors.urlError).nullable(),
        description: Yup.string()
          .max(1000, getDynamicMessage(Messages.errors.charactersMaxLimit, ['1000']))
      })
      .required(),
    collectionAvatar: Yup.object()
      .shape({
        collectionPicture: Yup.array().of(
          Yup.object().shape({
            file: Yup.mixed().nullable().test('', 'Avatar must not exceed 2MB in size',
              (file) => file && file.size ? file.size <= 2000000 : true
            ),
            size: Yup.object().nullable().test('', 'Banner must be at least 500 x 500 px',
              (size) => size ? size.width <= 500 && size.height <= 500 : true
            ),
          })
        )
      }).required(),
    collectionBanner: Yup.object()
      .shape({
        banner: Yup.array().of(
          Yup.object().shape({
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
            file: Yup.mixed().nullable().test('', 'Card must not exceed 2MB in size',
              (file) => file && file.size ? file.size <= 2000000 : true
            ),
            size: Yup.object().nullable().test('', 'Card must be 600 x 338 px',
            (size) => size ? size.width == 600 && size.height == 338 : true
          ),
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

  const validationForm = async (e) => {
    const errors = await validateForm(values);
    setFieldValue('collectionInfo.description', DOMPurify.sanitize(values.collectionInfo.description));
    e.preventDefault();
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        keysErrorsGroup.forEach(keyGroup => {

          const keysErrorsFields = Object.keys(errors[keyGroup]);

          keysErrorsFields.forEach(keyField => {
            setFieldTouched(`${keyGroup}.${keyField}`, true)
          });
        })
      }
      else {
        setIsOpen(true);
      }
    }
  }

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

  const Title = () => {
    return (
      <div style={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold', margin: '0px 24px' }}>
        Update collection
      </div>
    )
  }

  const Body = () => {
    return (
      <div style={{ minWidth: 200, textAlign: 'center' }}>
        The collection <span style={{ fontWeight: 'bold' }}>{(collectionAddress)}</span> will be updated
      </div>
    )
  }

  const DialogActions = () => {
    return (
      <div style={{ display: 'flex', margin: 'auto' }}>
        <button className="btn-main" style={{ marginRight: 8 }} onClick={(e) => { setIsOpen(false) }}>
          Cancel
        </button>
        <button form='updateCollection' className="btn-main" type="submit">
          Accept
          {(isLoadingRequest) && (
            <Spinner size='sm' className='ms-1' />
          )}
        </button>
      </div>
    )
  }

  return (
    <>
      <form id="updateCollection" autoComplete="off" onSubmit={handleSubmit} className="user-settings-form">
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
      <CustomizedDialogs propsDialog={{ title: Title(), body: Body(), dialogActions: DialogActions(), isOpen, setIsOpen }} />
      </form>
      <div className="d-flex justify-content-end mt-5">
        <button form="userSettings" type="submit" className="btn-main" onClick={validationForm}>
          Update Collection
        </button>
      </div>
    </>
  )
}

export default EditCollection;