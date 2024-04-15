import EnglishDictionary from './en';

import Constants from '../../../constants';

const { PARAM } = Constants.Variables;

export const getDynamicMessage = (message: string, params: string[]) => {
  return params.reduce((text, param) => text.replace(PARAM, param), message);
};

export { EnglishDictionary };

export default EnglishDictionary;
