// constants/Typography.ts
export const Typography = {
  sizes: {
    sm: 12, // subtitle, formFooter, inputLabel, belowtext, forgetpassword
    md: 14, // inputControl fontSize, rememberText fontSize
    lg: 17, // btnText fontSize
    xl: 20, // title fontSize
    xxxl: 32, // main title size
  },
  weights: {
    '400': 400 as const, // formFooter
    '500': 500 as const, // inputControl
    '600': 600 as const, // btnText, rememberText, inputLabel (but RN has Raleway-Regular for inputLabel)
    '700': 700 as const, // Raleway-Bold implicitly
    bold: 700 as const, // bold weight
    semiBold: 600 as const, // semi-bold weight
  },
  lineHeights: {
    normal: 1.5,
    subtitle: 18,
    title: 20,
    inputLabel: 19,
    btnText: 24,
  },
  letterSpacings: {
    sm: -0.1, // subtitle
    md: -0.2, // inputLabel
    lg: -0.6, // title
  },
  fontFamilies: {
    extraLight: 'Raleway-ExtraLight',
    bold: 'Raleway-Bold',
    regular: 'Raleway-Regular',
  },
};