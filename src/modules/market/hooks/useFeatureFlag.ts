import { featureFlags } from '../../../Config';

const useFeatureFlag = (feature: string) => {
  const isEnabled = featureFlags[feature];

  return isEnabled;
};

export default useFeatureFlag;