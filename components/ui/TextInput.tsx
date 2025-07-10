import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  View,
  TouchableOpacity,
  Platform, // Import Platform for checkbox scale
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing } from '../../constants';

interface TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  isPassword?: boolean;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  isPassword = false,
  error,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <View style={styles.input}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={isPassword ? styles.passwordContainer : styles.inputControlWrapper}>
        <RNTextInput
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          clearButtonMode="while-editing"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6b7280" // Consistent with RN
          style={isPassword ? styles.inputControlWithIcon : styles.inputControl}
          secureTextEntry={isPassword && !showPassword}
          value={value}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon
              name={!showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6b7280" // Consistent with RN
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.gray[700],
    marginBottom: 8,
    marginLeft: 4,
  },
  inputControlWrapper: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputControl: {
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.gray[800],
    flex: 1,
    height: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    paddingRight: 12,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputControlWithIcon: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    fontSize: 16,
    color: Colors.gray[800],
    fontWeight: '400',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
});