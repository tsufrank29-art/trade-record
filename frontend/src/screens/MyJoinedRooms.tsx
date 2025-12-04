import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const MyJoinedRooms = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>我加入的房間（Placeholder）</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a'
  },
  text: {
    color: '#e2e8f0'
  }
});

export default MyJoinedRooms;
