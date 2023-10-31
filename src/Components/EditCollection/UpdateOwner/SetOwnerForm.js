import { useFormik } from 'formik';
import { Field } from '@src/Components/Form'
import * as Yup from 'yup';
import CustomizedDialogs from '../Dialog';
import { useEffect, useState } from 'react';
import useSetOwner from '../hooks/useSetOwner';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {useQuery} from "@tanstack/react-query";
import {getOwnerCollections} from "@src/core/api/next/collectioninfo";
import { useRouter } from "next/router";
import {Spinner} from "@chakra-ui/react";

const SetOwnerForm = ({ address: collectionAddress }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [{ isLoading, response, error }, setNewOwner] = useSetOwner();
  const user = useSelector((state) => state.user);
  const router = useRouter();

  const { data, status, refetch } = useQuery({
    queryKey: ['Collections', user.address],
    queryFn: () => getOwnerCollections(user.address)
  })

  useEffect(() => {
    if (!isLoading) {
      if (error) {
        toast.error('Something went wrong!');
      } else if (response) {
        toast.success('It was updated successfully');
        setIsOpen(false);
        refetch(() => getOwnerCollections(user.address));
      }
    }
  }, [isLoading, response, error])

  useEffect(() => {
    if (data && !data?.data?.collections?.find((collection) => collection.address == collectionAddress)) router.push(`/account/${user.address}?tab=collections`)
  }, [data])


  const onSubmit = async () => {
    try {
      await setNewOwner(user.address, collectionAddress, values.address);

    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  }

  const addressValidation = Yup.object().shape({
    address: Yup.string().required()
  });

  const Title = () => {
    return (
      <div style={{ minWidth: 200, textAlign: 'center', fontWeight: 'bold', margin: '0px 24px' }}>
        Accept the new Collection Owner
      </div>
    )
  }

  const Body = () => {
    return (
      <div style={{ minWidth: 200, textAlign: 'center' }}>
        The collection <span style={{ fontWeight: 'bold' }}>{cutWalletAddress(collectionAddress)}</span> will be transferred to <span style={{ fontWeight: 'bold' }}>{cutWalletAddress(values.address)}</span>
      </div>
    )
  }

  const DialogActions = () => {
    return (
      <div style={{ display: 'flex', margin: 'auto' }}>
        <button className="btn-main" style={{ marginRight: 8 }} onClick={(e) => { setIsOpen(false) }}>
          Cancel
        </button>
        <button form='ownership' className="btn-main" type="submit">
          Accept
          {(isLoading) && (
            <Spinner size='sm' ms={1} />
          )}
        </button>
      </div>
    )
  }

  const formikProps = useFormik({
    onSubmit,
    validationSchema: addressValidation,
    initialValues: { address: '' },
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
    e.preventDefault();
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        setFieldTouched(`address`, true)
      }
      else {
        setIsOpen(true);
      }
    }
  }

  const cutWalletAddress = (address = '') => {
    const arrayAddress = address.split('')
    if (address.length > 10) {
      return arrayAddress.reduce((previousValue, currentValue, index) => {
        if (index < 6 || index > (address.length - 5)) {
          return `${previousValue}${currentValue}`
        }
        else if (index == 6) {
          return `${previousValue}...`
        }
        else {
          return previousValue
        }
      }, ``)
    }

    return address
  }

  return (
    <form id="ownership" autoComplete="off" onSubmit={handleSubmit} className="user-settings-form">
      <div>
      <Field
          type='input'
          name='collectionAddress'
          value={collectionAddress}
          title='Collection Address'
          placeholder=''
          description='Insert the address of the new owner'
          isRequired={true}
          isDisabled={true}
        />
        <Field
          type='input'
          name='address'
          value={values.address}
          error={errors.address}
          title='Wallet Address'
          placeholder='Wallet address'
          description='Insert the address of the new owner'
          isRequired={true}
          isDisabled={false}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      <div className='row'>
        <div className='col-2'>
          <button form="userSettings" className="btn-main" onClick={validationForm}>
            Submit
          </button>
        </div>
      </div>
      <CustomizedDialogs propsDialog={{ title: Title(), body: Body(), dialogActions: DialogActions(), isOpen, setIsOpen }} />
    </form>
  )
}

export default SetOwnerForm;