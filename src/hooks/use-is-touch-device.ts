import {useEffect, useState} from "react";

export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  return isTouchDevice;
};