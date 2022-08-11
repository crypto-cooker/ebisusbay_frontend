import EnglishDictionary from './en';

import Constants from '../constants';

const { PARAM } = Constants.Variables;

export const getDynamicMessage = (message, params) => {
  return params.reduce((text, param) => text.replace(PARAM, param), message);
};

export { EnglishDictionary };

export default EnglishDictionary;
