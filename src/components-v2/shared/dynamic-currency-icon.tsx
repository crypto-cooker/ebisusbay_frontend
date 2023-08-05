import {IconProps} from "@chakra-ui/icons";
import CronosIconFlat from "@src/components-v2/shared/icons/cronos";
import {appConfig} from "@src/Config";
import {useEffect, useState} from "react";
import {caseInsensitiveCompare} from "@src/utils";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";

const knownTokens = appConfig('tokens');

interface CurrencyIconMapperProps extends IconProps {
  address: string;
}

const DynamicCurrencyIcon = ({address, ...props}: CurrencyIconMapperProps) => {
  const [key, setKey] = useState<string>('cro');

  useEffect(() => {
    const value = Object.entries(knownTokens).find(([key, value]: [string, any]) => caseInsensitiveCompare(value.address, address));
    setKey(value?.[0] ?? 'cro');
  }, [address]);

  return key === 'frtn' ? (
    <FortuneIcon {...props} />
  ) : (
    <CronosIconBlue {...props} />
  );
}

export default DynamicCurrencyIcon;