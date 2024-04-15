import {appConfig} from "@src/Config";
import {ReactElement, useEffect, useState} from "react";
import {caseInsensitiveCompare} from "@market/helpers/utils";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {Box, ChakraProps, Image} from "@chakra-ui/react";

const knownTokens = appConfig('tokens');

const iconMapping: Record<string, (props: ChakraProps) => ReactElement> = {
  'frtn': (props) => <FortuneIcon {...props} />,
  'cro': (props) => <CronosIconBlue {...props} />,
  'wcro': (props) => <CronosIconBlue {...props} />,
  'bcro': (props) => <IconImage src='/img/icons/tokens/bcro-outline.webp' symbol='bcro' {...props} />,
  'mad': (props) => <IconImage src='/img/icons/tokens/mad.webp' symbol='mad' {...props} />,
  'vrse': (props) => <IconImage src='/img/icons/tokens/vrse.webp' symbol='vrse' {...props} />,
  'scratch': (props) => <IconImage src='/img/icons/tokens/scratch.webp' symbol='scratch' {...props} />,
  'candy': (props) => <IconImage src='/img/icons/tokens/candy.webp' symbol='candy' {...props} />,
  'ttt': (props) => <IconImage src='/img/icons/tokens/ttt.webp' symbol='ttt' {...props} />,
  'icy': (props) => <IconImage src='/img/icons/tokens/icy.webp' symbol='icy' {...props} />,
  'caw': (props) => <IconImage src='/img/icons/tokens/caw.webp' symbol='caw' {...props} />,
  'ryoshi': (props) => <IconImage src='/img/icons/tokens/ryoshi.webp' symbol='ryoshi' {...props} />,
  'trpz': (props) => <IconImage src='/img/icons/tokens/trpz.webp' symbol='trpz' {...props} />,
  'usdc': (props) => <IconImage src='/img/icons/tokens/usdc.webp' symbol='usdc' {...props} />,
  'lcro': (props) => <IconImage src='/img/icons/tokens/lcro.webp' symbol='lcro' {...props} />,
  'grve': (props) => <IconImage src='/img/icons/tokens/grve.webp' symbol='grve' {...props} />,
  'fish': (props) => <IconImage src='/img/icons/tokens/fish.webp' symbol='fish' {...props} />,
  'aiko': (props) => <IconImage src='/img/icons/tokens/aiko.webp' symbol='aiko' {...props} />,
};

const IconImage = ({ src, symbol, ...props }: ChakraProps & { src: string; symbol: string }) => (
  <Box width={props.boxSize} height={props.boxSize}>
    <Image src={src} alt={`${symbol.toUpperCase()} Icon`} rounded='full' title={symbol.toUpperCase()} {...props} boxSize={undefined} />
  </Box>
);

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