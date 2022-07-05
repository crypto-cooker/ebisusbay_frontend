import Constants from '../constants';

const { PARAM } = Constants.Variables;

const dictionary = {
  errors: {
    required: 'Required',
    invalidWalletAddress: 'Insert a valid wallet address',
    invalidEmail: 'Insert a valid email',
    typeError: 'Invalid characters',
    urlError: 'Insert a valid URL',
    pixelImageError: `The image format should be ${PARAM}x${PARAM} pixels`,
    invalidFormat: 'Invalid format',
    charactersMaxLimit: `You can not use more than ${PARAM} characters`,
    arrayMinLimit: `At least ${PARAM} item(s) is required`,
    minNumber: `Numbers greater than zero`,
  },
};

export default dictionary;
