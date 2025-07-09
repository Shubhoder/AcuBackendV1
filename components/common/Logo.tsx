import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Spacing } from '../../constants';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 160 }) => {
  return (
    <View style={[styles.container, { width: size, height: size / 2 }]}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=160&h=80' }}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});