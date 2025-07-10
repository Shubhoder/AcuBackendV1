// constants/Spacing.ts
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const Spacing = {
  // Global padding from container
  containerPadding: 24,

  // Heights based on Dimensions
  heightDiv19: height / 19,
  heightDiv7: height / 7,

  // Standard margins and paddings
  xs: 4, // extra small spacing
  sm: 6, // inputLabel marginBottom
  md: 8, // errorText marginTop (used for input error)
  lg: 10, // subtitle marginTop, rememberContainer marginTop
  xl: 16, // input marginBottom, inputControl paddingHorizontal
  xxl: 20, // header marginVertical
  xxxl: 24, // form marginBottom, formAction marginVertical, container padding
  // No specific equivalent for 20 in header marginVertical based on RN style
  // So, Spacing.xxl will be 20 for header marginVertical
};