import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'DM Sans, Helvetica, Arial, sans-serif',
    body: `DM Sans, Helvetica, Arial, sans-serif`,
  },
  spacing: (n) => 2 ** n,
  colors: {
    light: {
      textColor1: '#FFFFFF',
      textColor2: '#595d69',
      textColor3: '#0d0c22',
      textColor4: '#0078CB',
      textColor5: '#35669e',
      textColor6: '#750b1c',
      borderColor1: '#EB7D07',
      borderColor2: '#707070',
      borderColor3: '#0078CB',
      borderColor4: '#727272',
      borderColor5: '#8D8D8D',
      borderColor6: '#AA4A44',
      bgColor1: '#ffffff',
      bgColor2: '#ffffffdd',
      bgColor3: '#eeeeee',
      bgColor4: '#0078cb',
    },
    dark:{
      textColor1: '#000000',
      textColor2: '#a2a2a2',
      textColor3: '#FFFFFF',
      textColor4: '#0078CB',
      textColor5: '#ffffff',
      textColor6: '#c93152',
      borderColor1: '#EB7D07',
      borderColor2: '#707070',
      borderColor3: '#0078CB',
      borderColor4: '#727272',
      borderColor5: '#8D8D8D',
      borderColor6: '#AA4A44',
      bgColor1: '#212428',
      bgColor2: '#212428dd',
      bgColor3: '#212428',
      bgColor4: '#000000',
    },
    gray: {
      700: '#212428'
    }
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  components: {
    Button: {
      variants: {
        'legacy-outlined': (props)=>{
          return ({
          color: `${props.colorMode}.textColor5`,
          bg: `${props.colorMode}.bgColor1`,
          fontWeight: 800,
          padding: '8px 24px',
          fontSize: '14px',
          boxShadow: '2px 2px 20px 0px rgb(131 100 226 / 0%)',
          transition: 'all 0.3s ease',
          outline: 'none',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: '#ddd',
          borderRadius: '6px',
          _hover: {
            boxShadow: '2px 2px 20px 0px rgb(131 100 226 / 50%)',
            transition: 'all 0.3s ease',
          }
        })},
        'legacy': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'max-content',
          color: '#fff !important',
          background: '#218cff',
          borderRadius: '6px',
          letterSpacing: 'normal',
          fontWeight: 800,
          textDecoration: 'none',
          padding: '8px 24px',
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '2px 2px 20px 0px rgb(131 100 226 / 0%)',
          transition: 'all 0.3s ease',
          outline: 'none',
          _hover: {
            boxShadow: '2px 2px 20px 0px rgb(131 100 226 / 50%)',
            transition: 'all 0.3s ease'
          },
          _disabled: {
            border: '1px solid #cccccc'
          }
        }
      }
    },
    Modal: {
      variants: {
        'default': (props)=> ({
          dialog: {
            bg: `${props.colorMode}.bgColor1`
          }

        })
      },
      defaultProps: {
        variant: 'default'
      }
    }
  }

})

export default theme;