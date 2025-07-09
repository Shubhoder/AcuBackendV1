import { useAuthContext } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RecentItem, RecordingCard, StatsCard } from '../../components/home';
import { StatusBar } from '../../components/ui';
import { Colors, Spacing, Typography } from '../../constants';

interface RecentRecord {
  id: string;
  patientName: string;
  date: string;
  time: string;
  duration: string;
  isPlaying: boolean;
}

export default function HomeScreen() {
  const { user } = useAuthContext();
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([
    {
      id: '1',
      patientName: 'Patient Name',
      date: '28 May 2024',
      time: '04:22pm',
      duration: '00:30:40',
      isPlaying: false,
    },
    {
      id: '2',
      patientName: 'Patient Name',
      date: '28 May 2024',
      time: '04:22pm',
      duration: '00:30:40',
      isPlaying: false,
    },
  ]);

  const handleStatsPress = (type: 'pending' | 'sent') => {
    console.log(`${type} stats pressed`);
  };

  const handleRecordPress = () => {
    console.log('Record new dictation pressed');
  };

  const handleTogglePlay = (id: string) => {
    setRecentRecords(prev =>
      prev.map(record =>
        record.id === id
          ? { ...record, isPlaying: !record.isPlaying }
          : { ...record, isPlaying: false }
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar time="9:41" signalStrength={4} batteryLevel={80} />
      
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

        <RecordingCard onPress={handleRecordPress} />

        <View style={styles.recentsSection}>
          <Text style={styles.recentsTitle}>Recents</Text>
          {recentRecords.map(record => (
            <RecentItem
              key={record.id}
              patientName={record.patientName}
              date={record.date}
              time={record.time}
              duration={record.duration}
              isPlaying={record.isPlaying}
              onTogglePlay={() => handleTogglePlay(record.id)}
            />
          ))}
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
});