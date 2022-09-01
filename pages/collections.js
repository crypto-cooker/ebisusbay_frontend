import React, { useEffect, useState } from 'react';

import CollectionsComponent from '@src/Components/Collections';
import CollectionsOldEndPoint from '@src/Components/components/collections'
import useFeatureFlag from '@src/hooks/useFeatureFlag';
import Constants from '@src/constants';

const Collections = () => {
  const { Features } = Constants;
  const isInfinityQueryEnable = useFeatureFlag(Features.INFINITE_QUERY_COLLECTION);

  return isInfinityQueryEnable? <CollectionsComponent /> : <CollectionsOldEndPoint/>
};

export default Collections;
