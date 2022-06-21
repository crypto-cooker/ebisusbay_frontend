import React from 'react';

import { Form } from 'react-bootstrap';

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
}) => {
  return (
    <Form.Group className={`form-field mb-3 ${error ? 'field-message-error' : ''}`}>
      <div className="label-container">
        <Form.Label className="title">{title}</Form.Label>
        {isRequired ? <Form.Label className="required-label">*Required</Form.Label> : <Form.Label>Optional</Form.Label>}
      </div>
      <Form.Control
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={isDisabled}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Form.Text className="field-description text-muted">{error ? error : description}</Form.Text>
    </Form.Group>
  );
};

export default React.memo(Field, deepValidation);
