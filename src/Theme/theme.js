import {defineStyleConfig, extendTheme} from "@chakra-ui/react";
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
}

const Button = defineStyleConfig({
  variants: {
    primary: {
      bg: '#218cff',
      color: 'white',
      _hover: {
        bg: '#1E7EE6',
        _disabled: {
          bg: '#b3d7ff'
        }
      },
      _active: {
        bg: '#1B72CF'
      },
      _disabled: {
        color: 'white',
        bg: '#b3d7ffff'
      }
    },
    tab: {
      color: 'white',
      _active: {
        bg: '#35669e'
      }
    }
  }
});

const breakpoints = {
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
}

const customTheme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'DM Sans, Helvetica, Arial, sans-serif',
    body: `DM Sans, Helvetica, Arial, sans-serif`,
  },
  colors: {
    gray: grayColor
  },
  breakpoints,
  components: {
    Button,
    Switch: {
      baseStyle: {
        track: {
          _checked: {
            background: mode(lightTheme.textColor4, darkTheme.textColor4)
          },
        },
      },
    }
  }
})
export default customTheme