import {Field} from '@src/Components/Form'
import * as Yup from 'yup';
import CustomizedDialogs from '../Dialog';
import {useEffect, useState} from 'react';
import useClearOwner from '../hooks/useClearOwner';
import {toast} from 'react-toastify';
import {useQuery} from "@tanstack/react-query";
import {getOwnerCollections} from "@src/core/api/next/collectioninfo";
import {useRouter} from "next/router";
import {Spinner} from "@chakra-ui/react";
import {useUser} from "@src/components-v2/useUser";

const ClearOwnerForm = ({ address: collectionAddress }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [{ isLoading, response, error }, clearCollectionOwner] = useClearOwner();
  const user = useUser();
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
      }
      refetch(() => getOwnerCollections(user.address));
    }
  }, [isLoading, response, error])

  useEffect(() => {
    if (data && !data?.data?.collections?.find((collection) => collection.address == collectionAddress)) router.push(`/account/${user.address}?tab=collections`)
  }, [data])


  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await clearCollectionOwner(user.address, collectionAddress);

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
        Clear Collection Owner
      </div>
    )
  }

  const Body = () => {
    return (
      <div style={{ minWidth: 200, textAlign: 'center' }}>
        Do you want to clear the owner of the collection?
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

  const validationForm = async (e) => {
    e.preventDefault();
    setIsOpen(true);
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
    <form id="ownership" autoComplete="off" onSubmit={onSubmit} className="user-settings-form">
      <div>
        <Field
          type='input'
          name='address'
          value={collectionAddress}
          title='Collection Address'
          placeholder=''
          description=''
          isRequired={true}
          isDisabled={true}
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

export default ClearOwnerForm;