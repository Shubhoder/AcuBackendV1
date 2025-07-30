import { useAuthContext } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RecordingCard, StatsCard } from '../../components/home';
import { AudioCard } from '../../components/audio';
import { StatusBar } from '../../components/ui';
import { Colors, Spacing, Typography } from '../../constants';
import { useOutboxContext } from '../../contexts/OutboxContext';
import { AudioService } from '../../services/audioService';

export default function HomeScreen() {
  const authContext = useAuthContext();
  const user = authContext.user;
  const outboxContext = useOutboxContext();
  const recordings = outboxContext.recordings;
  const deleteRecording = outboxContext.deleteRecording;
  
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Get the 10 most recent recordings
  const recentRecordings = recordings
    .sort((a, b) => {
      // Sort by date and time (most recent first)
      const dateA = new Date(`${a.dateRecorded} ${a.timeRecorded}`);
      const dateB = new Date(`${b.dateRecorded} ${b.timeRecorded}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10); // Limit to 10 most recent

  const handleStatsPress = (type: 'pending' | 'sent') => {
    // Handle stats navigation or action
    // TODO: Implement navigation to stats screen
    console.log(`Stats pressed: ${type}`);
  };

  const handleRecordPress = () => {
    // This will be handled by the dynamic rendering in record.tsx
    // The RecordingCard component will trigger the recording flow
    console.log('Record button pressed - recording flow initiated');
  };

  const handleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleShare = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Sharing recording:', id);
      // TODO: Implement share functionality
    }
  };

  const handleSend = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Sending recording:', id);
      // TODO: Implement send functionality
    }
  };

  const handleDelete = (id: string) => {
    const recording = recordings.find(r => r.id === id);
    if (recording) {
      console.log('Deleting recording:', id);
      // TODO: Implement delete functionality with confirmation
      deleteRecording(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.subtitle}>Choose from the below options</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatsCard
            title="Pending"
            value="9"
            onPress={() => handleStatsPress('pending')}
          />
          <StatsCard
            title="Sent"
            value="73"
            onPress={() => handleStatsPress('sent')}
          />
        </View>
        

        <RecordingCard onPress={() => router.push('/record')} />

        <View style={styles.recentsSection}>
          <Text style={styles.recentsTitle}>Recents</Text>
          {recentRecordings.length > 0 ? (
            recentRecordings.map(record => (
              <AudioCard
                key={record.id}
                id={record.id}
                title={record.title || record.filename}
                sender="Dr. Rajeev" // Default sender
                date={`${record.dateRecorded} | ${record.timeRecorded}`}
                duration={AudioService.formatDuration(record.duration)}
                uri={record.uri}
                expanded={expandedCardId === record.id}
                waveformData={record.waveformData?.map(data => data.amplitude)}
                onExpand={() => handleExpand(record.id)}
                showActions={true}
                onShare={() => handleShare(record.id)}
                onSend={() => handleSend(record.id)}
                onDelete={() => handleDelete(record.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent recordings</Text>
              <Text style={styles.emptyStateSubtext}>Start recording to see your recent audio files here</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  welcome: {
    fontSize: Typography.sizes.lg,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  recentsSection: {
    marginTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  recentsTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});