import {
  FormControl as FormControlCK,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

const FormControl = ({name, type, label, value, error, touched, helperText, onChange, onBlur}) => {
  
  return (
    <FormControlCK
      id={name}
      name={name}
      isInvalid={error && touched}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
      {!(error && touched) ? (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      ) : (
        <FormErrorMessage>{error}</FormErrorMessage>
      )}
    </FormControlCK>
  );
};

export default FormControl;