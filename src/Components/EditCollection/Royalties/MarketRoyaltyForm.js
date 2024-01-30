import {useFormik} from "formik";
import * as Yup from "yup";
import {toast} from "react-toastify";
import {createSuccessfulTransactionToastContent} from "@src/utils";
import {Box, Text} from "@chakra-ui/react";
import {Field} from "@src/Components/Form";
import React from "react";
import {useContractService} from "@src/components-v2/useUser";

const MarketRoyaltyForm = ({address: collectionAddress}) => {
  const contractService = useContractService();

  const validationSchema = Yup.object().shape({
    ipHolder: Yup.string().required().label('IP Holder'),
    value: Yup.number().max(100).required().label('Royalty %'),
  });

  const onSubmit = async () => {
    try {
      const tx = await contractService.market.registerRoyaltyAsOwner(collectionAddress, values.ipHolder, values.value);
      const receipt = await tx.wait();
      toast.success(createSuccessfulTransactionToastContent(receipt.transactionHash));
    } catch (error) {
      console.log(error);
      toast.error('Error');
    }
  }

  const formikProps = useFormik({
    onSubmit,
    validationSchema: validationSchema,
    initialValues: {
      ipHolder: '',
      value: ''
    },
    enableReinitialize: true,
  });

  const {
    values,
    errors,
    handleChange,
    setFieldTouched,
    handleBlur,
    handleSubmit,
    validateForm,
  } = formikProps;

  const validationForm = async (e) => {
    const errors = await validateForm(values);
    if (errors) {
      const keysErrorsGroup = Object.keys(errors);
      if (keysErrorsGroup.length > 0) {
        keysErrorsGroup.forEach(keyGroup => {

          const keysErrorsFields = Object.keys(errors[keyGroup]);

          keysErrorsFields.forEach(keyField => {
            setFieldTouched(`${keyGroup}.${keyField}`, true)
          });
        })
      }
    }
  }

  return (
    <Box>
      <Text mb={4}>Contract owners can change the market royalty which will affect all tokens of this contract</Text>
      <form id="royalties" autoComplete="off" onSubmit={handleSubmit} className="collection-royalties-form">
        <Field
          type='input'
          name='ipHolder'
          value={values.ipHolder}
          error={errors.ipHolder}
          title='IP Holder'
          placeholder=''
          description='Address that will be receiving royalties'
          isRequired={true}
          isDisabled={false}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Field
          type='input'
          name='value'
          value={values.value}
          error={errors.value}
          title='New Royalty %'
          placeholder=''
          description=''
          isRequired={true}
          isDisabled={false}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className='row'>
          <div className='col-2'>
            <button form="royalties" type="submit" className="btn-main" onClick={validationForm}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </Box>
  )
}

export default MarketRoyaltyForm;