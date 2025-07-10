import { StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Typography } from '../constants';

const { height } = Dimensions.get('window');

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // #F9FAFB
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.containerPadding, // 24
    paddingTop: Spacing.heightDiv19, // height / 19
    paddingBottom: Spacing.containerPadding, // 24
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 0.4 opacity
    zIndex: 100,
  },
  cornerimage: {
    position: 'absolute',
    top: 0,
    right: -15, // Adjusted from RN -15
    width: 170, // Example size, adjust based on your asset
    height: 170, // Example size, adjust based on your asset
    resizeMode: 'contain',
    zIndex: 101,
  },
  appLogoContainer: {
    width: 207,
    height: 61,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 100,
    marginTop: Spacing.heightDiv7, // height / 7
    marginBottom: 40, // Space below logo, adjust if original RN has different
  },
  appLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  header: {
    marginVertical: Spacing.xxl, // 20
  },
  title: {
    fontSize: Typography.sizes.xl, // 20
    letterSpacing: Typography.letterSpacings.lg, // -0.6
    lineHeight: Typography.lineHeights.title, // 20
    fontFamily: Typography.fontFamilies.bold, // Raleway-Bold
    color: Colors.text.primary, // #1a1c1e
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.sm, // 12
    letterSpacing: Typography.letterSpacings.sm, // -0.1
    lineHeight: Typography.lineHeights.subtitle, // 18
    fontFamily: Typography.fontFamilies.regular, // Raleway-Regular
    color: Colors.text.secondary, // #6c7278
    textAlign: 'center',
    width: 222, // From RN
    marginTop: Spacing.lg, // 10
    alignSelf: 'center',
  },
  form: {
    marginBottom: Spacing.xxxl, // 24
  },
  formAction: {
    marginVertical: Spacing.xxxl, // 24
  },
  formFooter: {
    fontSize: Typography.sizes.sm, // 12
    fontWeight: Typography.weights['400'], // 400
    color: Colors.text.secondary, // #6c7278
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: Colors.primary, // #0093D0
  },
  rememberMeContainerWrapper: {
    marginTop: -6, // To align checkbox correctly with input spacing
  },
  // Specific styles for signup screen if needed, e.g., for two-column inputs
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs, // Using gap from RN for consistency (you had marginHorizontal: -Spacing.xs)
    marginBottom: Spacing.xl, // For spacing between rows
  },
  nameField: {
    flex: 1,
    // marginHorizontal: Spacing.xs, // Handled by gap on parent
  },
  credentialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs, // Using gap from RN for consistency
    marginBottom: Spacing.xl, // For spacing between rows
  },
  credentialsField: {
    flex: 1,
    // marginHorizontal: Spacing.xs, // Handled by gap on parent
  },
}); 