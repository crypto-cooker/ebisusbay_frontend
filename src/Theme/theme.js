export const lightTheme = {
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
  borderColor3: '#0078CB',
  borderColor4: '#727272',
  borderColor5: '#8D8D8D',
  borderColor6: '#AA4A44',
  bgColor1: '#212428',
  bgColor2: '#212428dd',
  bgColor3: '#212428',
  bgColor4: '#000000',
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
    return theme;
  } else if (mode === 'dark') {
    return { ...theme, colors: darkTheme };
  }
};
