import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants';

interface StatusBarProps {
  time: string;
  signalStrength: number;
  batteryLevel: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time,
  signalStrength,
  batteryLevel,
}) => {
  const renderSignalBars = () => {
    const bars = [];
    for (let i = 0; i < 4; i++) {
      bars.push(
        <View
          key={i}
          style={[
            styles.signalBar,
            i < signalStrength && styles.activeSignalBar,
          ]}
        />
      );
    }
    return bars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.rightSection}>
        <View style={styles.signalContainer}>
          {renderSignalBars()}
        </View>
        <View style={styles.battery}>
          <View style={[styles.batteryLevel, { width: `${batteryLevel}%` }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  time: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.primary,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  signalBar: {
    width: 3,
    height: 4,
    backgroundColor: Colors.gray[400],
    marginRight: 1,
  },
  activeSignalBar: {
    backgroundColor: Colors.text.primary,
  },
  battery: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  batteryLevel: {
    height: '100%',
    backgroundColor: Colors.text.primary,
    borderRadius: 1,
  },
});