import React from 'react';

import { deepValidation } from '../../helpers/validator';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon
} from "@chakra-ui/react";

const Field = ({
  type,
  name,
  value,
  error,
  title,
  placeholder,
  description,
  isRequired,
  isDisabled,
  onChange,
  onBlur,
  addOn
}) => {
  return (
    <FormControl className={`form-field mb-3 ${error ? 'field-message-error' : ''}`} isInvalid={!!error}>
      <div className="label-container">
        <FormLabel className="title">{title}</FormLabel>
        {isRequired ? <FormLabel className="required-label">*Required</FormLabel> : <FormLabel>Optional</FormLabel>}
      </div>

      <InputGroup>
          {addOn && (
            <InputLeftAddon id="basic-addon1">@</InputLeftAddon>
          )}
          <Input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            onChange={onChange}
            onBlur={onBlur}
          />
      </InputGroup>
      <FormHelperText className="field-description text-muted">{description}</FormHelperText>
      <FormErrorMessage className="field-description text-muted">{error}</FormErrorMessage>
    </FormControl>
  );
};

export default React.memo(Field, deepValidation);
