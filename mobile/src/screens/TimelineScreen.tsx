import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, dashboardStore } from '../store/useStore';
import { TimeBlock, TIME_BLOCK_COLORS } from '../types';

const BLOCK_EMOJIS = ['😴', '💪', '🧠', '💻', '📚', '☕', '🍱', '📞', '🧘', '🎮', '🎬', '🚶'];
const BLOCK_COLORS: Array<TimeBlock['color']> = ['coding', 'study', 'exercise', 'break', 'meeting', 'other'];

const formatHour = (hour: number) => {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m > 0 ? `${displayH}:${m.toString().padStart(2, '0')} ${ampm}` : `${displayH} ${ampm}`;
};

export function TimelineScreen() {
  const state = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  
  const [blockActivity, setBlockActivity] = useState('');
  const [blockEmoji, setBlockEmoji] = useState('💻');
  const [blockColor, setBlockColor] = useState<TimeBlock['color']>('coding');
  const [blockStartHour, setBlockStartHour] = useState('9');
  const [blockEndHour, setBlockEndHour] = useState('10');

  const currentHour = new Date().getHours() + new Date().getMinutes() / 60;

  const openAddModal = () => {
    setEditingBlock(null);
    setBlockActivity('');
    setBlockEmoji('💻');
    setBlockColor('coding');
    setBlockStartHour('9');
    setBlockEndHour('10');
    setModalVisible(true);
  };

  const openEditModal = (block: TimeBlock) => {
    setEditingBlock(block.id);
    setBlockActivity(block.activity);
    setBlockEmoji(block.emoji);
    setBlockColor(block.color);
    setBlockStartHour(block.startHour.toString());
    setBlockEndHour(block.endHour.toString());
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!blockActivity.trim()) return;
    const start = parseFloat(blockStartHour);
    const end = parseFloat(blockEndHour);
    if (isNaN(start) || isNaN(end) || start >= end) {
      Alert.alert('Invalid Time', 'Please enter valid start and end times');
      return;
    }
    
    if (editingBlock) {
      dashboardStore.updateTimeBlock(editingBlock, {
        activity: blockActivity.trim(),
        emoji: blockEmoji,
        color: blockColor,
        startHour: start,
        endHour: end,
      });
    } else {
      dashboardStore.addTimeBlock({
        activity: blockActivity.trim(),
        emoji: blockEmoji,
        color: blockColor,
        startHour: start,
        endHour: end,
      });
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Block', 'Are you sure you want to delete this time block?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dashboardStore.deleteTimeBlock(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🗓️ Today's Timeline</Text>
          <Text style={styles.subtitle}>Plan your day</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Current Time Indicator */}
      <View style={styles.currentTimeBar}>
        <Text style={styles.currentTimeText}>Now: {formatHour(currentHour)}</Text>
      </View>

      {/* Timeline */}
      <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
        {state.timeBlocks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyText}>No time blocks yet</Text>
            <Text style={styles.emptyHint}>Tap + Add to plan your day</Text>
          </View>
        ) : (
          state.timeBlocks.map((block) => {
            const isActive = currentHour >= block.startHour && currentHour < block.endHour;
            const isPast = currentHour >= block.endHour;
            const duration = block.endHour - block.startHour;
            
            return (
              <TouchableOpacity
                key={block.id}
                style={[
                  styles.blockCard,
                  { borderLeftColor: TIME_BLOCK_COLORS[block.color] },
                  isActive && styles.blockCardActive,
                  isPast && styles.blockCardPast,
                ]}
                onPress={() => openEditModal(block)}
                onLongPress={() => handleDelete(block.id)}
              >
                <View style={styles.blockTime}>
                  <Text style={styles.blockTimeText}>{formatHour(block.startHour)}</Text>
                  <Text style={styles.blockTimeDivider}>↓</Text>
                  <Text style={styles.blockTimeText}>{formatHour(block.endHour)}</Text>
                </View>
                
                <View style={styles.blockContent}>
                  <View style={styles.blockHeader}>
                    <Text style={styles.blockEmoji}>{block.emoji}</Text>
                    <Text style={styles.blockActivity}>{block.activity}</Text>
                    {isActive && <View style={styles.liveDot} />}
                  </View>
                  <Text style={styles.blockDuration}>
                    {duration >= 1 ? `${Math.floor(duration)}h` : ''} 
                    {duration % 1 > 0 ? ` ${Math.round((duration % 1) * 60)}m` : ''}
                  </Text>
                </View>

                <View style={[styles.colorIndicator, { backgroundColor: TIME_BLOCK_COLORS[block.color] }]} />
              </TouchableOpacity>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              {editingBlock ? 'Edit Time Block' : 'New Time Block'}
            </Text>
            
            <Text style={styles.inputLabel}>Activity Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Coding, Meeting, Gym"
              value={blockActivity}
              onChangeText={setBlockActivity}
            />

            <Text style={styles.inputLabel}>Emoji</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
              <View style={styles.emojiRow}>
                {BLOCK_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[styles.emojiOption, blockEmoji === emoji && styles.emojiOptionSelected]}
                    onPress={() => setBlockEmoji(emoji)}
                  >
                    <Text style={styles.emojiOptionText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <Text style={styles.inputLabel}>Color Category</Text>
            <View style={styles.colorRow}>
              {BLOCK_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: TIME_BLOCK_COLORS[color] },
                    blockColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setBlockColor(color)}
                >
                  {blockColor === color && <Text style={styles.colorCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <Text style={styles.inputLabel}>Start Hour (0-24)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="9"
                  value={blockStartHour}
                  onChangeText={setBlockStartHour}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.inputLabel}>End Hour (0-24)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  value={blockEndHour}
                  onChangeText={setBlockEndHour}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn, !blockActivity.trim() && styles.saveBtnDisabled]} 
                onPress={handleSave}
                disabled={!blockActivity.trim()}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFDF5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  currentTimeBar: {
    backgroundColor: '#D1FAE5',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  currentTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#047857',
  },
  timeline: {
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
  },
  blockCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  blockCardActive: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#22C55E',
  },
  blockCardPast: {
    opacity: 0.6,
  },
  blockTime: {
    width: 60,
    alignItems: 'center',
  },
  blockTimeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  blockTimeDivider: {
    fontSize: 10,
    color: '#D1D5DB',
    marginVertical: 2,
  },
  blockContent: {
    flex: 1,
    marginLeft: 12,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockEmoji: {
    fontSize: 20,
  },
  blockActivity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  blockDuration: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
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
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  emojiScroll: {
    marginBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  emojiOption: {
    width: 48,
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  emojiOptionSelected: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  emojiOptionText: {
    fontSize: 22,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#1F2937',
  },
  colorCheck: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
