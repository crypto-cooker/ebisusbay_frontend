import {appConfig} from "@src/config";
import {ReactElement, useEffect, useState} from "react";
import {ciEquals} from "@market/helpers/utils";
import CronosIconBlue from "@src/components-v2/shared/icons/cronos-blue";
import FortuneIcon from "@src/components-v2/shared/icons/fortune";
import {Box, ChakraProps, Image} from "@chakra-ui/react";
import ImageService from "@src/core/services/image";

const knownTokens = appConfig('tokens');

const iconMapping: Record<string, (props: ChakraProps) => ReactElement> = {
  'frtn': (props) => <FortuneIcon {...props} />,
  'cro': (props) => <CronosIconBlue {...props} />,
  'wcro': (props) => <CronosIconBlue {...props} />,
  'bcro': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/bcro-outline.webp').convert()} symbol='bcro' {...props} />,
  'mad': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/mad.webp').convert()} symbol='mad' {...props} />,
  'vrse': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/vrse.webp').convert()} symbol='vrse' {...props} />,
  'scratch': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/scratch.webp').convert()} symbol='scratch' {...props} />,
  'candy': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/candy.webp').convert()} symbol='candy' {...props} />,
  'ttt': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/ttt.webp').convert()} symbol='ttt' {...props} />,
  'icy': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/icy.webp').convert()} symbol='icy' {...props} />,
  'caw': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/caw.webp').convert()} symbol='caw' {...props} />,
  'ryoshi': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/ryoshi.webp').convert()} symbol='ryoshi' {...props} />,
  'trpz': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/trpz.webp').convert()} symbol='trpz' {...props} />,
  'usdc': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/usdc.webp').convert()} symbol='usdc' {...props} />,
  'lcro': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/lcro.webp').convert()} symbol='lcro' {...props} />,
  'grve': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/grve.webp').convert()} symbol='grve' {...props} />,
  'fish': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/fish.webp').convert()} symbol='fish' {...props} />,
  'aiko': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/aiko.webp').convert()} symbol='aiko' {...props} />,
  'coom': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/coom.webp').convert()} symbol='coom' {...props} />,
  'fftb': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/fftb.webp').convert()} symbol='fftb' {...props} />,
  'mery': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/mery.webp').convert()} symbol='mery' {...props} />,
  'emit': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/emit.webp').convert()} symbol='emit' {...props} />,
  'lwv': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/lwv.webp').convert()} symbol='lwv' {...props} />,
  'btcronos': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/btcronos.webp').convert()} symbol='btcronos' {...props} />,
  'robin': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/robin.webp').convert()} symbol='robin' {...props} />,
  'sumo': (props) => <IconImage src={ImageService.translate('/img/icons/tokens/sumo.webp').convert()} symbol='sumo' {...props} />,
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
      ([_, tokenValue]: [string, any]) => ciEquals(tokenValue.address, address)
    );

    setIconKey(value?.[0] || 'cro');
  }, [address]);

  const IconComponent = iconMapping[iconKey];
  const FallbackComponent = <IconImage src={ImageService.translate(`/files/dex/images/tokens/${iconKey}.webp`).convert()} symbol={iconKey} {...props} />
  return IconComponent ? IconComponent(props) : FallbackComponent;
}

export default DynamicCurrencyIcon;