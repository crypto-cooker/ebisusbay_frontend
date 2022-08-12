import React from 'react';

import {Form, InputGroup} from 'react-bootstrap';

import { deepValidation } from '../../helpers/validator';

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
    <Form.Group className={`form-field mb-3 ${error ? 'field-message-error' : ''}`}>
      <div className="label-container">
        <Form.Label className="title">{title}</Form.Label>
        {isRequired ? <Form.Label className="required-label">*Required</Form.Label> : <Form.Label>Optional</Form.Label>}
      </div>

      <InputGroup>
          {addOn && (
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          )}
          <Form.Control
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            onChange={onChange}
            onBlur={onBlur}
          />
      </InputGroup>
      <Form.Text className="field-description text-muted">{error ? error : description}</Form.Text>
    </Form.Group>
  );
};

export default React.memo(Field, deepValidation);
