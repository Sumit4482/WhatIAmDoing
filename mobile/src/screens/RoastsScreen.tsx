import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store/useStore';

const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const hours = Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function RoastsScreen() {
  const state = useStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch new roasts from the server
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Roasts</Text>
        <Text style={styles.subtitle}>What visitors are saying</Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoEmoji}>💬</Text>
        <Text style={styles.infoText}>
          Visitors can leave roasts on your web dashboard. Pull down to refresh!
        </Text>
      </View>

      {/* Roasts List */}
      <ScrollView 
        style={styles.list} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {state.roasts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🦗</Text>
            <Text style={styles.emptyText}>No roasts yet</Text>
            <Text style={styles.emptyHint}>Share your dashboard to get some roasts!</Text>
          </View>
        ) : (
          state.roasts.map((roast, index) => (
            <View key={roast.id} style={styles.roastCard}>
              <View style={styles.roastHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{roast.name[0].toUpperCase()}</Text>
                </View>
                <View style={styles.roastMeta}>
                  <Text style={styles.roastName}>{roast.name}</Text>
                  <Text style={styles.roastTime}>{formatTimeAgo(roast.timestamp)}</Text>
                </View>
                <Text style={styles.roastNumber}>#{state.roasts.length - index}</Text>
              </View>
              <Text style={styles.roastMessage}>{roast.message}</Text>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Stats Footer */}
      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{state.roasts.length}</Text>
          <Text style={styles.statLabel}>Total Roasts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {state.roasts.filter(r => {
              const hours = (Date.now() - new Date(r.timestamp).getTime()) / 1000 / 60 / 60;
              return hours < 24;
            }).length}
          </Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF1F2',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  infoBanner: {
    backgroundColor: '#FECDD3',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDA4AF',
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#9F1239',
    flex: 1,
    lineHeight: 18,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  emptyHint: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  roastCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F472B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  roastMeta: {
    flex: 1,
    marginLeft: 12,
  },
  roastName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  roastTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  roastNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  roastMessage: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  statsFooter: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: '#FECDD3',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E11D48',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#FECDD3',
  },
});
