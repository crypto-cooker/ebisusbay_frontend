import {appConfig} from "@src/Config";
import {ReactElement, useEffect, useState} from "react";
import {caseInsensitiveCompare} from "@src/utils";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {Box, ChakraProps, Image} from "@chakra-ui/react";

const knownTokens = appConfig('tokens');

const iconMapping: Record<string, (props: ChakraProps) => ReactElement> = {
  'frtn': (props) => <FortuneIcon {...props} />,
  'cro': (props) => <CronosIconBlue {...props} />,
  'bcro': (props) => (
    <Box width={props.boxSize} height={props.boxSize}>
      <Image src='/img/icons/bcro-outline.png' alt='bCRO Icon' title='bCRO' {...props} boxSize={undefined} />
    </Box>
  ),
  'mad': (props) => (
    <Box width={props.boxSize} height={props.boxSize}>
      <Image src='/img/icons/mad.png' alt='MAD Icon' title='MAD' {...props} boxSize={undefined} />
    </Box>
  ),
  'vrse': (props) => (
    <Box width={props.boxSize} height={props.boxSize}>
      <Image src='/img/icons/vrse.png' alt='VRSE Icon' title='VRSE' {...props} boxSize={undefined} />
    </Box>
  )
};

interface CurrencyIconMapperProps extends ChakraProps {
  address: string;
}

const DynamicCurrencyIcon = ({address, ...props}: CurrencyIconMapperProps) => {
  const [iconKey, setIconKey] = useState<string>('cro');

  useEffect(() => {
    const value = Object.entries(knownTokens).find(
      ([_, tokenValue]: [string, any]) => caseInsensitiveCompare(tokenValue.address, address)
    );

    setIconKey(value?.[0] || 'cro');
  }, [address]);

  const IconComponent = iconMapping[iconKey];
  return IconComponent ? IconComponent(props) : null;
}

export default DynamicCurrencyIcon;