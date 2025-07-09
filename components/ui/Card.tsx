import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  elevation?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = Spacing.lg,
  elevation = 2,
}) => {
  return (
    <View style={[
      styles.card,
      { padding, elevation },
      style,
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});