import React, {useEffect} from 'react';
import {useFrame} from '../../utilities/frame';

export interface Props {}

function Loading() {
  const {startLoading, stopLoading} = useFrame();

  useEffect(
    () => {
      startLoading();
      return () => {
        stopLoading();
      };
    },
    [startLoading, stopLoading],
  );

  return null;
}

export default React.memo(Loading);
