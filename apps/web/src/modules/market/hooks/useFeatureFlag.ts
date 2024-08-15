import { featureFlags } from '../../../config';

const useFeatureFlag = (feature: string) => {
  const isEnabled = featureFlags[feature];

  return isEnabled;
};

export default useFeatureFlag;