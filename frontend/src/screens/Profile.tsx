import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>暱稱：{user?.nickname ?? 'N/A'}</Text>
      <Text style={styles.text}>Email：{user?.email ?? 'N/A'}</Text>
      <Button title="登出" onPress={logout} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    gap: 8
  },
  text: {
    color: '#e2e8f0'
  }
});

export default Profile;
