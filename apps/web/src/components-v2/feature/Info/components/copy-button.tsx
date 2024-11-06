import { ElementType, SVGAttributes, useCallback, useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { SpaceProps } from 'styled-system';
import { DefaultTheme } from 'styled-components';

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement>, SpaceProps {
  theme?: DefaultTheme;
  spin?: boolean;
}

const CopyIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M15 1H4C2.9 1 2 1.9 2 3V16C2 16.55 2.45 17 3 17C3.55 17 4 16.55 4 16V4C4 3.45 4.45 3 5 3H15C15.55 3 16 2.55 16 2C16 1.45 15.55 1 15 1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM18 21H9C8.45 21 8 20.55 8 20V8C8 7.45 8.45 7 9 7H18C18.55 7 19 7.45 19 8V20C19 20.55 18.55 21 18 21Z" />
    </svg>
  );
};

export const copyText = (text: string, cb?: () => void) => {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text).then(cb);
  } else if (document.queryCommandSupported('copy')) {
    const ele = document.createElement('textarea');
    ele.value = text;
    document.body.appendChild(ele);
    ele.select();
    document.execCommand('copy');
    document.body.removeChild(ele);
    cb?.();
  }
};

interface CopyButtonProps extends SvgProps {
  text: string;
  tooltipMessage: string;
  buttonColor?: string;
  icon?: ElementType;
}

export const CopyButton: React.FC<React.PropsWithChildren<CopyButtonProps>> = ({
  text,
  tooltipMessage,
  width,
  buttonColor = 'primary',
  icon: Icon = CopyIcon,
  ...props
}) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const displayTooltip = useCallback(() => {
    setIsTooltipDisplayed(true);
  }, []);

  const handleOnClick = useCallback(() => {
    copyText(text, displayTooltip);
  }, [text, displayTooltip]);

  return (
    <>
      <div>
        <Button onClick={handleOnClick} scale="sm" variant="text" style={{ width: 'auto', position: 'relative' }}>
          <Icon color={buttonColor} width={width} {...props} />
        </Button>
      </div>
    </>
  );
};
