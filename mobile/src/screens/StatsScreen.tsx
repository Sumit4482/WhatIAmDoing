import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, dashboardStore } from '../store/useStore';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function StatsScreen() {
  const state = useStore();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const last30Days = state.heatmapData.slice(-30);
  const mentalDays = last30Days.filter(d => d.mental).length;
  const physicalDays = last30Days.filter(d => d.physical).length;
  const bothDays = last30Days.filter(d => d.mental && d.physical).length;

  // Calculate current streaks
  let mentalStreak = 0;
  let physicalStreak = 0;
  for (let i = state.heatmapData.length - 1; i >= 0; i--) {
    if (state.heatmapData[i].mental) mentalStreak++;
    else break;
  }
  for (let i = state.heatmapData.length - 1; i >= 0; i--) {
    if (state.heatmapData[i].physical) physicalStreak++;
    else break;
  }

  // Group heatmap data by weeks (last 52 weeks)
  const weeks: Array<typeof state.heatmapData> = [];
  const recentData = state.heatmapData.slice(-364);
  for (let i = 0; i < recentData.length; i += 7) {
    weeks.push(recentData.slice(i, i + 7));
  }

  const getHeatmapColor = (day: typeof state.heatmapData[0]) => {
    if (day.mental && day.physical) return '#22C55E'; // Both done - green
    if (day.mental) return '#A78BFA'; // Mental only - purple
    if (day.physical) return '#60A5FA'; // Physical only - blue
    return '#E5E7EB'; // None - gray
  };

  const handleDayPress = (day: typeof state.heatmapData[0]) => {
    setSelectedDay(day.date);
    setEditModalVisible(true);
  };

  const toggleDayMental = () => {
    if (!selectedDay) return;
    const day = state.heatmapData.find(d => d.date === selectedDay);
    if (day) {
      dashboardStore.updateHeatmapDay(selectedDay, !day.mental, day.physical);
    }
  };

  const toggleDayPhysical = () => {
    if (!selectedDay) return;
    const day = state.heatmapData.find(d => d.date === selectedDay);
    if (day) {
      dashboardStore.updateHeatmapDay(selectedDay, day.mental, !day.physical);
    }
  };

  const selectedDayData = selectedDay ? state.heatmapData.find(d => d.date === selectedDay) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📊 Your Stats</Text>
          <Text style={styles.subtitle}>Track your progress</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🧠</Text>
            <Text style={styles.statValue}>{mentalDays}/30</Text>
            <Text style={styles.statLabel}>Mental (30d)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>💪</Text>
            <Text style={styles.statValue}>{physicalDays}/30</Text>
            <Text style={styles.statLabel}>Physical (30d)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{bothDays}</Text>
            <Text style={styles.statLabel}>Both Done</Text>
          </View>
        </View>

        {/* Current Streaks */}
        <View style={styles.streaksRow}>
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>{mentalStreak} days</Text>
              <Text style={styles.streakLabel}>Mental Streak</Text>
            </View>
          </View>
          <View style={styles.streakCard}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View>
              <Text style={styles.streakValue}>{physicalStreak} days</Text>
              <Text style={styles.streakLabel}>Physical Streak</Text>
            </View>
          </View>
        </View>

        {/* Heatmap Legend */}
        <View style={styles.legendSection}>
          <Text style={styles.sectionTitle}>Activity Heatmap</Text>
          <Text style={styles.legendHint}>Tap any day to edit</Text>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#E5E7EB' }]} />
              <Text style={styles.legendText}>None</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#A78BFA' }]} />
              <Text style={styles.legendText}>Mental</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#60A5FA' }]} />
              <Text style={styles.legendText}>Physical</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendText}>Both</Text>
            </View>
          </View>
        </View>

        {/* Heatmap Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.heatmapScroll}>
          <View style={styles.heatmapContainer}>
            {/* Month labels */}
            <View style={styles.monthLabels}>
              {MONTHS.map((month, i) => (
                <Text key={month} style={[styles.monthLabel, { left: i * (4.3 * 12) }]}>{month}</Text>
              ))}
            </View>
            
            {/* Day labels */}
            <View style={styles.dayLabels}>
              <Text style={styles.dayLabel}>Mon</Text>
              <Text style={styles.dayLabel}>Wed</Text>
              <Text style={styles.dayLabel}>Fri</Text>
            </View>

            {/* Heatmap grid */}
            <View style={styles.heatmapGrid}>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.heatmapWeek}>
                  {week.map((day) => (
                    <TouchableOpacity
                      key={day.date}
                      style={[styles.heatmapDay, { backgroundColor: getHeatmapColor(day) }]}
                      onPress={() => handleDayPress(day)}
                      activeOpacity={0.7}
                    />
                  ))}
                  {/* Fill empty days at end of week */}
                  {week.length < 7 && Array(7 - week.length).fill(0).map((_, i) => (
                    <View key={`empty-${i}`} style={[styles.heatmapDay, { backgroundColor: 'transparent' }]} />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Completion Rate */}
        <View style={styles.completionSection}>
          <Text style={styles.sectionTitle}>Completion Rate (Last 30 Days)</Text>
          <View style={styles.completionBars}>
            <View style={styles.completionRow}>
              <Text style={styles.completionLabel}>🧠 Mental</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, styles.progressMental, { width: `${(mentalDays / 30) * 100}%` }]} />
              </View>
              <Text style={styles.completionPercent}>{Math.round((mentalDays / 30) * 100)}%</Text>
            </View>
            <View style={styles.completionRow}>
              <Text style={styles.completionLabel}>💪 Physical</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, styles.progressPhysical, { width: `${(physicalDays / 30) * 100}%` }]} />
              </View>
              <Text style={styles.completionPercent}>{Math.round((physicalDays / 30) * 100)}%</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Edit Day Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Day</Text>
            <Text style={styles.modalDate}>
              {selectedDay && new Date(selectedDay).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>

            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleCard, selectedDayData?.mental && styles.toggleCardActive]}
                onPress={toggleDayMental}
              >
                <Text style={styles.toggleEmoji}>🧠</Text>
                <Text style={styles.toggleLabel}>Mental</Text>
                <Text style={styles.toggleStatus}>
                  {selectedDayData?.mental ? '✓ Done' : '○ Not done'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleCard, selectedDayData?.physical && styles.toggleCardActive]}
                onPress={toggleDayPhysical}
              >
                <Text style={styles.toggleEmoji}>💪</Text>
                <Text style={styles.toggleLabel}>Physical</Text>
                <Text style={styles.toggleStatus}>
                  {selectedDayData?.physical ? '✓ Done' : '○ Not done'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  streaksRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  streakEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
  },
  streakLabel: {
    fontSize: 12,
    color: '#B45309',
  },
  legendSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  legendHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  heatmapScroll: {
    marginTop: 16,
  },
  heatmapContainer: {
    paddingHorizontal: 20,
    paddingLeft: 50,
  },
  monthLabels: {
    height: 20,
    position: 'relative',
    marginBottom: 4,
  },
  monthLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#9CA3AF',
  },
  dayLabels: {
    position: 'absolute',
    left: 20,
    top: 24,
    height: 84,
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  heatmapGrid: {
    flexDirection: 'row',
  },
  heatmapWeek: {
    flexDirection: 'column',
    marginRight: 3,
  },
  heatmapDay: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginBottom: 3,
  },
  completionSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  completionBars: {
    marginTop: 12,
    gap: 12,
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionLabel: {
    width: 90,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressMental: {
    backgroundColor: '#A78BFA',
  },
  progressPhysical: {
    backgroundColor: '#60A5FA',
  },
  completionPercent: {
    width: 50,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  modalDate: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  toggleCardActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
  },
  toggleEmoji: {
    fontSize: 32,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
  },
  toggleStatus: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  doneBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
