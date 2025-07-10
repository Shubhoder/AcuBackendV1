// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large'; // Keep size prop for flexibility if other buttons use it
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, loading, style, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn, // Apply the base RN button style
        style, // Allow overrides
      ]}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text.white} />
      ) : (
        <Text style={[styles.btnText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});