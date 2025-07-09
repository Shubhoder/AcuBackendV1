import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  isPassword = false,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedContainer,
        error && styles.errorContainer,
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <RNTextInput
          style={[styles.input, style]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.text.light}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            {showPassword ? (
              <EyeOff size={20} color={Colors.text.light} />
            ) : (
              <Eye size={20} color={Colors.text.light} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
  },
  focusedContainer: {
    borderColor: Colors.primary,
  },
  errorContainer: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});