import React from 'react';
import Form from 'react-bootstrap/Form';

const Switch = ({ isChecked = false, setIsChecked, checkedText = '', uncheckedText = '', switchId = 'isVerifiedSwitch', labelStyle = {margin: '-27px 8px 0px', width: 92}}) => {

  const updateIsChecked = () => {
    setIsChecked(!isChecked);
  }

  return (
    <>
      <div>
        <div>
          <Form.Check
            type='switch'
            id={switchId}
            checked={isChecked}
            onChange={updateIsChecked}
          />
        </div>
        <div style={{ color: isChecked ? 'white' : 'black', textAlign: isChecked ? 'start' : 'end', ...labelStyle }} onClick={updateIsChecked}>
          {isChecked ? checkedText : uncheckedText}
        </div>
      </div>
    </>
  )
}

export default Switch;