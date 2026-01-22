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

const EMOJI_OPTIONS = ['📋', '💪', '🧠', '📚', '✍️', '🏃', '🧘', '💻', '📞', '🎯', '⭐', '🔥'];

export function TasksScreen() {
  const state = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskEmoji, setTaskEmoji] = useState('📋');

  const completedCount = state.tasks.filter(t => t.completed === true).length;
  const skippedCount = state.tasks.filter(t => t.completed === false).length;
  const pendingCount = state.tasks.filter(t => t.completed === null).length;

  const openAddModal = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskEmoji('📋');
    setModalVisible(true);
  };

  const openEditModal = (task: typeof state.tasks[0]) => {
    setEditingTask(task.id);
    setTaskTitle(task.title);
    setTaskEmoji(task.emoji);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!taskTitle.trim()) return;
    if (editingTask) {
      dashboardStore.updateTask(editingTask, { title: taskTitle.trim(), emoji: taskEmoji });
    } else {
      dashboardStore.addTask(taskTitle.trim(), taskEmoji);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dashboardStore.deleteTask(id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>📋 Today's Tasks</Text>
          <Text style={styles.subtitle}>
            ✓ {completedCount} Done  •  ✗ {skippedCount} Skipped  •  ⏳ {pendingCount} Pending
          </Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {state.tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptyHint}>Tap + Add to create your first task</Text>
          </View>
        ) : (
          state.tasks.map((task) => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                task.completed === true && styles.taskCardDone,
                task.completed === false && styles.taskCardSkipped,
              ]}
            >
              <TouchableOpacity 
                style={styles.taskMain}
                onPress={() => openEditModal(task)}
              >
                <Text style={styles.taskEmoji}>{task.emoji}</Text>
                <Text style={[
                  styles.taskTitle,
                  task.completed === true && styles.taskTitleDone,
                ]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.taskActions}>
                {task.completed === null ? (
                  <>
                    <TouchableOpacity
                      style={[styles.taskBtn, styles.doneBtn]}
                      onPress={() => dashboardStore.setTaskStatus(task.id, true)}
                    >
                      <Text style={styles.taskBtnText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.taskBtn, styles.skipBtn]}
                      onPress={() => dashboardStore.setTaskStatus(task.id, false)}
                    >
                      <Text style={styles.taskBtnText}>✗</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={[styles.taskBtn, styles.undoBtn]}
                    onPress={() => dashboardStore.setTaskStatus(task.id, null)}
                  >
                    <Text style={styles.taskBtnText}>↩</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.taskBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(task.id)}
                >
                  <Text style={styles.taskBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Edit Task' : 'New Task'}
            </Text>
            
            <Text style={styles.inputLabel}>Task Name</Text>
            <TextInput
              style={styles.input}
              placeholder="What do you need to do?"
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />

            <Text style={styles.inputLabel}>Emoji</Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.emojiOption, taskEmoji === emoji && styles.emojiOptionSelected]}
                  onPress={() => setTaskEmoji(emoji)}
                >
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveBtn, !taskTitle.trim() && styles.saveBtnDisabled]} 
                onPress={handleSave}
                disabled={!taskTitle.trim()}
              >
                <Text style={styles.saveBtnText}>
                  {editingTask ? 'Save' : 'Add Task'}
                </Text>
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
    backgroundColor: '#F5F3FF',
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
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
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
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  taskCardDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  taskCardSkipped: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  taskMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskEmoji: {
    fontSize: 24,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  taskBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtn: {
    backgroundColor: '#DCFCE7',
  },
  skipBtn: {
    backgroundColor: '#FEF3C7',
  },
  undoBtn: {
    backgroundColor: '#E0E7FF',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  taskBtnText: {
    fontSize: 18,
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
    marginBottom: 20,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
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
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  emojiOptionText: {
    fontSize: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
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
    backgroundColor: '#8B5CF6',
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
