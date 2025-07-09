import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  size?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  size = 20,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={[
        styles.checkbox,
        { width: size, height: size },
        checked && styles.checkedBox,
      ]}>
        {checked && <Check size={size - 8} color={Colors.white} />}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: Colors.gray[400],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
});