import Constants from '../../../constants';

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
    charactersMinLimit: `Value must be at least ${PARAM} characters`,
    charactersMaxLimit: `Value must be fewer than ${PARAM} characters`,
    arrayMinLimit: `At least ${PARAM} item(s) is required`,
    minNumber: `Numbers greater than zero`,
    usernameFormat: 'Value must only contain alphanumeric characters, dashes, underscores',
    urlStart: `URL must start with ${PARAM}`
  },
};

export default dictionary;
