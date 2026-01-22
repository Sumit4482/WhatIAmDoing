import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, dashboardStore } from '../store/useStore';
import { MOOD_OPTIONS, ACTIVITY_PRESETS, Mood } from '../types';

export function HomeScreen() {
  const state = useStore();
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (state.currentActivity?.isLive) {
      const interval = setInterval(() => {
        const start = new Date(state.currentActivity!.startedAt).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000 / 60));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.currentActivity]);

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const completedTasks = state.tasks.filter(t => t.completed === true).length;
  const totalTasks = state.tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Hey Sumit!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        {/* Mood Card */}
        <TouchableOpacity style={styles.moodCard} onPress={() => setMoodModalVisible(true)}>
          <View style={styles.moodContent}>
            <Text style={styles.moodEmoji}>{state.mood.emoji}</Text>
            <View style={styles.moodText}>
              <Text style={styles.moodLabel}>{state.mood.label}</Text>
              <Text style={styles.moodDesc}>{state.mood.description}</Text>
            </View>
          </View>
          <Text style={styles.moodChange}>Tap to change</Text>
        </TouchableOpacity>

        {/* Current Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ Current Activity</Text>
        </View>
        
        {state.currentActivity?.isLive ? (
          <View style={styles.activityCard}>
            <View style={styles.activityMain}>
              <Text style={styles.activityEmoji}>{state.currentActivity.emoji}</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{state.currentActivity.title}</Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>{formatDuration(elapsed)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.activityActions}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.stopBtn]} 
                onPress={() => dashboardStore.stopActivity()}
              >
                <Text style={styles.actionBtnText}>⏹️ Stop</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.switchBtn]} 
                onPress={() => {
                  dashboardStore.clearActivity();
                  setActivityModalVisible(true);
                }}
              >
                <Text style={styles.actionBtnText}>🔄 Switch</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.startActivityCard} 
            onPress={() => setActivityModalVisible(true)}
          >
            <Text style={styles.startActivityEmoji}>🚀</Text>
            <Text style={styles.startActivityText}>Start an Activity</Text>
            <Text style={styles.startActivityHint}>Tap to begin tracking</Text>
          </TouchableOpacity>
        )}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📋</Text>
            <Text style={styles.statValue}>{completedTasks}/{totalTasks}</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🧠</Text>
            <Text style={styles.statValue}>{state.dailyChallenge.mental.done ? '✓' : '○'}</Text>
            <Text style={styles.statLabel}>Mental</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💪</Text>
            <Text style={styles.statValue}>{state.dailyChallenge.physical.done ? '✓' : '○'}</Text>
            <Text style={styles.statLabel}>Physical</Text>
          </View>
        </View>

        {/* Daily Duo Quick View */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏆 Daily Duo</Text>
        </View>
        <View style={styles.duoRow}>
          <TouchableOpacity 
            style={[styles.duoCard, state.dailyChallenge.mental.done && styles.duoCardDone]}
            onPress={() => dashboardStore.toggleMentalChallenge()}
          >
            <Text style={styles.duoEmoji}>🧠</Text>
            <Text style={styles.duoTitle} numberOfLines={1}>{state.dailyChallenge.mental.title}</Text>
            <Text style={styles.duoStreak}>🔥 {state.dailyChallenge.mental.streak}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.duoCard, state.dailyChallenge.physical.done && styles.duoCardDone]}
            onPress={() => dashboardStore.togglePhysicalChallenge()}
          >
            <Text style={styles.duoEmoji}>💪</Text>
            <Text style={styles.duoTitle} numberOfLines={1}>{state.dailyChallenge.physical.title}</Text>
            <Text style={styles.duoStreak}>🔥 {state.dailyChallenge.physical.streak}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Mood Modal */}
      <Modal visible={moodModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setMoodModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How are you feeling?</Text>
            <View style={styles.moodGrid}>
              {MOOD_OPTIONS.map((mood) => (
                <TouchableOpacity
                  key={mood.label}
                  style={[styles.moodOption, state.mood.label === mood.label && styles.moodOptionSelected]}
                  onPress={() => {
                    dashboardStore.setMood(mood);
                    setMoodModalVisible(false);
                  }}
                >
                  <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodOptionLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Activity Modal */}
      <Modal visible={activityModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setActivityModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start Activity</Text>
            <View style={styles.activityGrid}>
              {ACTIVITY_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.type}
                  style={styles.activityOption}
                  onPress={() => {
                    dashboardStore.startActivity(preset.type, preset.title, preset.emoji);
                    setActivityModalVisible(false);
                  }}
                >
                  <Text style={styles.activityOptionEmoji}>{preset.emoji}</Text>
                  <Text style={styles.activityOptionLabel}>{preset.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5FF',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  moodCard: {
    backgroundColor: '#E0F2FE',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  moodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodText: {
    marginLeft: 12,
    flex: 1,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0369A1',
  },
  moodDesc: {
    fontSize: 13,
    color: '#0284C7',
    marginTop: 2,
  },
  moodChange: {
    fontSize: 11,
    color: '#0EA5E9',
    marginTop: 8,
    textAlign: 'right',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  activityCard: {
    backgroundColor: '#DCFCE7',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  activityMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityEmoji: {
    fontSize: 36,
  },
  activityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803D',
    fontVariant: ['tabular-nums'],
  },
  activityActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopBtn: {
    backgroundColor: '#FEE2E2',
  },
  switchBtn: {
    backgroundColor: '#FEF3C7',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  startActivityCard: {
    backgroundColor: '#F3E8FF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9D5FF',
    borderStyle: 'dashed',
  },
  startActivityEmoji: {
    fontSize: 32,
  },
  startActivityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C3AED',
    marginTop: 8,
  },
  startActivityHint: {
    fontSize: 12,
    color: '#A78BFA',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  duoRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  duoCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  duoCardDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  duoEmoji: {
    fontSize: 24,
  },
  duoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 6,
    textAlign: 'center',
  },
  duoStreak: {
    fontSize: 11,
    color: '#F97316',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  moodOption: {
    width: 80,
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  moodOptionSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0EA5E9',
  },
  moodOptionEmoji: {
    fontSize: 28,
  },
  moodOptionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginTop: 4,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  activityOption: {
    width: 100,
    height: 90,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  activityOptionEmoji: {
    fontSize: 32,
  },
  activityOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 6,
  },
});
