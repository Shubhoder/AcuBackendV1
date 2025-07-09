import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Mic } from 'lucide-react-native';
import { Card } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';

interface RecordingCardProps {
  onPress: () => void;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.waveformBackground}>
          <View style={styles.waveform}>
            {Array.from({ length: 20 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.waveformBar,
                  { height: Math.random() * 30 + 10 },
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.micContainer}>
          <Mic size={32} color={Colors.white} />
        </View>
        <Text style={styles.title}>Record New Dictation</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
  },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  waveformBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    opacity: 0.1,
  },
  waveformBar: {
    width: 3,
    backgroundColor: Colors.gray[400],
    marginHorizontal: 1,
    borderRadius: 1,
  },
  micContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.primary,
  },
});