import { defineStyleConfig, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const lightTheme = {
  textColor1: '#FFFFFF',
  textColor2: '#595d69',
  textColor3: '#0d0c22',
  textColor4: '#0078CB',
  textColor5: '#35669e',
  textColor6: '#750b1c',
  borderColor1: '#EB7D07',
  borderColor2: '#707070',
  borderColor3: '#218cff',
  borderColor4: '#727272',
  borderColor5: '#8D8D8D',
  borderColor6: '#AA4A44',
  bgColor1: '#ffffff',
  bgColor2: '#ffffffdd',
  bgColor3: '#eeeeee',
  bgColor4: '#0078cb',
  bgColor5: '#eeeeee',
  success:  '#12a17d',
  failure: '#a11259'
};

export const darkTheme = {
  textColor1: '#000000',
  textColor2: '#a2a2a2',
  textColor3: '#FFFFFF',
  textColor4: '#0078CB',
  textColor5: '#ffffff',
  textColor6: '#c93152',
  borderColor1: '#EB7D07',
  borderColor2: '#707070',
  borderColor3: '#218cff',
  borderColor4: '#727272',
  borderColor5: '#8D8D8D',
  borderColor6: '#AA4A44',
  bgColor1: '#212428',
  bgColor2: '#212428dd',
  bgColor3: '#212428',
  bgColor4: '#000000',
  bgColor5: '#333333',
  success:  '#12a17d',
  failure: '#a11259'
};

export const theme = {
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  breakpointsNum: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
  },
  colors: lightTheme,
};

export const getTheme = (mode) => {
  if (mode === 'light') {
    return { ...theme, colors: lightTheme };
  } else if (mode === 'dark') {
    return { ...theme, colors: darkTheme };
  }
  return { ...theme, colors: darkTheme };
};

const grayColor = {
  // 100: '#ff0000',
  // 200: '#00ff00',
  // 300: '#0000ff',
  // 400: '#ffff00',
  // 500: '#ff00ff',
  // 600: '#00ffff',
  700: '#212428',
  // 800: '#000000',
  // 900: '#888888',
};

const blueColor = {
  200: '#0d6efd',
};

const Button = defineStyleConfig({
  variants: {
    primary: {
      bg: '#218cff',
      color: 'white',
      _hover: {
        bg: '#1E7EE6',
        _disabled: {
          bg: '#b3d7ff',
        },
      },
      _active: {
        bg: '#1B72CF',
      },
      _disabled: {
        color: 'white',
        bg: '#b3d7ffff',
      },
    },
    tab: {
      color: 'white',
      _active: {
        bg: '#35669e',
      },
    },
    ryoshiDynasties: {
      bg: '#F48F0C',
      color: 'white',
      _hover: {
        bg: '#dc810b',
        _disabled: {
          bg: '#7a4806',
          textShadow: 'none',
        },
      },
      _active: {
        bg: '#c3720a',
      },
      _disabled: {
        color: 'white',
        bg: '#7a4806ff',
        textShadow: 'none',
      },
      rounded: 'lg',
      textShadow:
        '-1px -1px 0 #9f2729,\n' +
        '          0   -1px 0 #9f2729,\n' +
        '          1px -1px 0 #9f2729,\n' +
        '          1px  0   0 #9f2729,\n' +
        '          1px  1px 0 #9f2729,\n' +
        '          0    1px 0 #9f2729,\n' +
        '          -1px  1px 0 #9f2729,\n' +
        '          -1px  0   0 #9f2729;',
    },
  },
});

const breakpoints = {
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
};

const customTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'var(--font-dm-sans), DM_Sans, DM Sans, Helvetica, Arial, sans-serif',
    body: `var(--font-dm-sans), DM_Sans, DM Sans, Helvetica, Arial, sans-serif`,
  },
  colors: {
    light: lightTheme,
    dark: darkTheme,
    gray: grayColor,
    blue: blueColor,
    ryoshiDynasties: {
      100: '#f7fafc',
      200: '#FDAB1A',
      900: '#1a202c',
    },
  },
  radii: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    default: '6px', // custom default border radius
    small: '3px', // custom small border radius
    rounded: '20px', // custom rounded border radius
    circle: '50%',
  },
  breakpoints,
  components: {
    Button,
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            background: (props) => `${props.colorMode}.textColor4`,
          },
        },
      },
    },
  },
});
export default customTheme;
