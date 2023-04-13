import {Flex, Text, Textarea} from "@chakra-ui/react";
import {FormControl as FormControlCK} from "@src/Components/components/chakra-components";
import React, {forwardRef, useImperativeHandle} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";

export interface BundleDrawerFormHandle {
  submitForm: () => void;
  hasErrors: () => boolean;
  validate: () => Promise<boolean>;
  reset: () => void;
  values: () => void;
}

interface BundleDrawerFormProps {
  onSubmit: (values: any) => void;
}

const BundleDrawerForm = forwardRef<BundleDrawerFormHandle, BundleDrawerFormProps>(({onSubmit}, ref) => {
  useImperativeHandle(ref, () => ({
    submitForm() {
      handleSubmit();
    },
    hasErrors() {
      return !!errors.description && errors.description.length > 1;
    },
    async validate() {
      return !(await validationForm());
    },
    reset() {
      resetForm();
    },
    values() {
      resetForm();
    }
  }));

  const initialValuesBundle = {
    title: '',
    description: '',
  }

  const bundleValidation = Yup.object().shape({
    title: Yup.string().required('Required'),
    description: Yup.string()
  });

  const validationForm = async () => {
    const errors = await validateForm(values);
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        await setFieldTouched(`title`, true)
        await setFieldTouched(`description`, true)
        return true;
      }
      else {
        return false;
      }
    }
    return false
  }

  const formikProps = useFormik({
    onSubmit: onSubmit,
    validationSchema: bundleValidation,
    initialValues: initialValuesBundle,
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
    resetForm
  } = formikProps;

  return (
    <Flex flexDirection="column">
      <FormControlCK
        name={'title'}
        label={'Title'}
        value={values?.title}
        error={errors?.title}
        touched={touched?.title}
        onChange={handleChange}
        onBlur={handleBlur}
        type={'text'}
        helperText=''
        disabled={false}
      />
      <Text mb='8px'>Description</Text>
      <Textarea
        onChange={handleChange}
        size='sm'
        resize='none'
        name='description'
        value={values.description}
        onBlur={handleBlur}
      />
    </Flex>
  )
});

export default BundleDrawerForm;