import {Flex, Text, Textarea} from "@chakra-ui/react";
import {FormControl as FormControlCK} from "@src/Components/components/chakra-components";
import React, {forwardRef, useImperativeHandle} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";

const ListingBundleDrawerForm = forwardRef(({onSubmit}, ref) => {
  useImperativeHandle(ref, () => ({
    submitForm() {
      handleSubmit();
    },
    hasErrors() {
      return errors.length > 1;
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
    price: Yup.number().integer().max(10000000).required('Required'),
    title: Yup.string().required('Required'),
    description: Yup.string()
  });

  const validationForm = async () => {
    const errors = await validateForm(values);
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        await setFieldTouched(`price`, true)
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
        name={'price'}
        label={'Price'}
        value={values?.price}
        error={errors?.price}
        touched={touched?.price}
        onChange={handleChange}
        onBlur={handleBlur}
        type={'number'}
      />
      <FormControlCK
        name={'title'}
        label={'Title'}
        value={values?.title}
        error={errors?.title}
        touched={touched?.title}
        onChange={handleChange}
        onBlur={handleBlur}
        type={'text'}
      />
      <Text mb='8px'>Description</Text>
      <Textarea
        onChange={handleChange}
        size='sm'
        type='text'
        resize='none'
        name='description'
        value={values.description}
        onBlur={handleBlur}
      />
    </Flex>
  )
});

export default ListingBundleDrawerForm;