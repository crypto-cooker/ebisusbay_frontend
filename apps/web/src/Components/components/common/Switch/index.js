import React from 'react';
import {FormControl, FormLabel, HStack, Stack, Switch as ChakraSwitch, Text} from '@chakra-ui/react';

const Switch = ({ isChecked = false, setIsChecked, text = '', switchId = 'isVerifiedSwitch'}) => {

  const updateIsChecked = () => {
    setIsChecked(!isChecked);
  }

  return (
    <>
      <FormControl display='flex' alignItems='center'>
        <FormLabel htmlFor={switchId} mb='0'>
          {text}
        </FormLabel>
        <ChakraSwitch
          size="lg"
          id={switchId}
          checked={isChecked}
          onChange={updateIsChecked}
        />
      </FormControl>
    </>
  )
}

export default Switch;