import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login({ email, password });
    } catch (error: any) {
      Alert.alert('登入失敗', error?.response?.data?.message || '請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>歡迎進入股神俱樂部</Text>
      <Text style={styles.subtitle}>登入</Text>
      <View style={styles.formGroup}>
        <Text>Email</Text>
        <TextInput
          placeholder="you@example.com"
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          testID="email-input"
        />
      </View>
      <View style={styles.formGroup}>
        <Text>密碼</Text>
        <TextInput
          placeholder="••••••"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          testID="password-input"
        />
      </View>
      <Button title={loading ? '登入中...' : '登入'} onPress={onSubmit} disabled={loading} testID="login-button" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0f172a'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: 20
  },
  formGroup: {
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 4
  }
});

export default Login;
