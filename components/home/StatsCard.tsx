import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Card } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';

interface StatsCardProps {
  title: string;
  value: string;
  onPress: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <ChevronRight size={20} color={Colors.text.light} />
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: Typography.sizes.xxxl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
});