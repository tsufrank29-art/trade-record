import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRooms } from '@/hooks/useRooms';

const RoomsOverview = () => {
  const { data, isLoading, isError } = useRooms();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.muted}>載入中...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.muted}>無法取得房間列表</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>創建者：{item.owner}</Text>
            <Text style={styles.subtitle}>人數：{item.member_count} · 週期：{item.trading_cycle}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>尚無房間</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  title: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '700'
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: 4
  },
  muted: {
    color: '#94a3b8'
  }
});

export default RoomsOverview;
