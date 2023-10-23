import React from 'react';
import {FormLabel} from "@chakra-ui/react";

const RadioGroup = ({ name, value, title, isRequired, options, onChange }) => {
  const onSelectOption = (value) => () => {
    onChange(name, value);
  };

  return (
    <fieldset className="radio-group form-field">
      <div className="label-container">
        <FormLabel className="title">{title}</FormLabel>
        {isRequired ? <FormLabel className="required-label">*Required</FormLabel> : <FormLabel>Optional</FormLabel>}
      </div>
      {options.map((option) => (
        <div key={option.value}>
          <input
            type="radio"
            className={option.value}
            name={`${name}-${option.value}`}
            id={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={onSelectOption(option.value)}
          />
          <label htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </fieldset>
  );
};

export default RadioGroup;
