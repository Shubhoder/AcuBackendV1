import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Play, Pause } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface RecentItemProps {
  patientName: string;
  date: string;
  time: string;
  duration: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const RecentItem: React.FC<RecentItemProps> = ({
  patientName,
  date,
  time,
  duration,
  isPlaying,
  onTogglePlay,
}) => {
  const renderWaveform = () => {
    return (
      <View style={styles.waveform}>
        {Array.from({ length: 15 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.waveformBar,
              { height: Math.random() * 20 + 5 },
              isPlaying && i < 8 && styles.activeWaveformBar,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onTogglePlay} style={styles.playButton}>
        {isPlaying ? (
          <Pause size={16} color={Colors.primary} />
        ) : (
          <Play size={16} color={Colors.primary} />
        )}
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.patientName}>{patientName}</Text>
        <Text style={styles.dateTime}>{date} | {time}</Text>
        {renderWaveform()}
      </View>
      
      <Text style={styles.duration}>{duration}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  patientName: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  dateTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  waveformBar: {
    width: 2,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 1,
    borderRadius: 1,
  },
  activeWaveformBar: {
    backgroundColor: Colors.primary,
  },
  duration: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
});