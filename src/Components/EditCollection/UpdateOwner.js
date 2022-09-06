import React, { useState } from 'react';
import { RadioGroup } from '../Form';

import SetOwnerForm from './SetOwnerForm';
import ClearOwnerForm from './ClearOwnerForm';

const optionsRadioGroup = [{ value: 'setOwner', label: 'Transfer ownership' }, { value: 'clearOwner', label: 'Claim ownership' }]

const UpdateOwner = ({ address }) => {

  const [activeForm, setActiveForm] = useState('setOwner')

  const changeActiveForm = (name, value) => {
    setActiveForm(value)
  }

  return (
    <>
      <div >
        <div className='row'>
          <div className='col-8'>
            <h2>Ownership</h2>
            <div className='mb-3'>
              <RadioGroup name='radioGroupForm'
                title='Select type'
                value={activeForm}
                options={optionsRadioGroup}
                onChange={changeActiveForm}
                isRequired
              />
            </div>
            {activeForm == 'setOwner' ? <SetOwnerForm address={address} /> : <ClearOwnerForm address={address} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateOwner;