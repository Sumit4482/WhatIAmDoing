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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, dashboardStore } from '../store/useStore';

export function DailyDuoScreen() {
  const state = useStore();
  const [mentalModalVisible, setMentalModalVisible] = useState(false);
  const [physicalModalVisible, setPhysicalModalVisible] = useState(false);
  
  const [mentalTitle, setMentalTitle] = useState(state.dailyChallenge.mental.title);
  const [mentalDetail, setMentalDetail] = useState(state.dailyChallenge.mental.detail);
  const [mentalDifficulty, setMentalDifficulty] = useState(state.dailyChallenge.mental.difficulty || 'Medium');
  
  const [physicalTitle, setPhysicalTitle] = useState(state.dailyChallenge.physical.title);
  const [physicalQuantity, setPhysicalQuantity] = useState(state.dailyChallenge.physical.quantity);
  const [physicalDetail, setPhysicalDetail] = useState(state.dailyChallenge.physical.detail);

  const handleSaveMental = () => {
    dashboardStore.setMentalChallenge(mentalTitle, mentalDetail, mentalDifficulty);
    setMentalModalVisible(false);
  };

  const handleSavePhysical = () => {
    dashboardStore.setPhysicalChallenge(physicalTitle, physicalQuantity, physicalDetail);
    setPhysicalModalVisible(false);
  };

  const bothDone = state.dailyChallenge.mental.done && state.dailyChallenge.physical.done;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🏆 Daily Duo</Text>
          <Text style={styles.subtitle}>Complete both challenges every day</Text>
        </View>

        {/* Status Banner */}
        <View style={[styles.statusBanner, bothDone && styles.statusBannerDone]}>
          <Text style={styles.statusEmoji}>{bothDone ? '🎉' : '💪'}</Text>
          <Text style={styles.statusText}>
            {bothDone ? 'Both challenges completed!' : 'Keep pushing!'}
          </Text>
        </View>

        {/* Mental Challenge */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🧠 Mental Challenge</Text>
          <TouchableOpacity onPress={() => setMentalModalVisible(true)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.challengeCard, state.dailyChallenge.mental.done && styles.challengeCardDone]}
          onPress={() => dashboardStore.toggleMentalChallenge()}
          activeOpacity={0.8}
        >
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{state.dailyChallenge.mental.title}</Text>
            {state.dailyChallenge.mental.difficulty && (
              <View style={[
                styles.difficultyBadge,
                state.dailyChallenge.mental.difficulty === 'Easy' && styles.difficultyEasy,
                state.dailyChallenge.mental.difficulty === 'Medium' && styles.difficultyMedium,
                state.dailyChallenge.mental.difficulty === 'Hard' && styles.difficultyHard,
              ]}>
                <Text style={styles.difficultyText}>{state.dailyChallenge.mental.difficulty}</Text>
              </View>
            )}
          </View>
          <Text style={styles.challengeDetail}>{state.dailyChallenge.mental.detail}</Text>
          
          <View style={styles.challengeFooter}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {state.dailyChallenge.mental.streak}-day streak</Text>
            </View>
            <View style={[styles.statusIndicator, state.dailyChallenge.mental.done && styles.statusDone]}>
              <Text style={styles.statusIndicatorText}>
                {state.dailyChallenge.mental.done ? '✓ Done' : 'Tap to complete'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Physical Challenge */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>💪 Physical Challenge</Text>
          <TouchableOpacity onPress={() => setPhysicalModalVisible(true)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.challengeCard, styles.challengeCardPhysical, state.dailyChallenge.physical.done && styles.challengeCardDone]}
          onPress={() => dashboardStore.togglePhysicalChallenge()}
          activeOpacity={0.8}
        >
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{state.dailyChallenge.physical.title}</Text>
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{state.dailyChallenge.physical.quantity}</Text>
            </View>
          </View>
          <Text style={styles.challengeDetail}>{state.dailyChallenge.physical.detail}</Text>
          
          <View style={styles.challengeFooter}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {state.dailyChallenge.physical.streak}-day streak</Text>
            </View>
            <View style={[styles.statusIndicator, state.dailyChallenge.physical.done && styles.statusDone]}>
              <Text style={styles.statusIndicatorText}>
                {state.dailyChallenge.physical.done ? '✓ Done' : 'Tap to complete'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipsText}>• Complete both challenges to maintain your streak</Text>
          <Text style={styles.tipsText}>• Mental: LeetCode, reading, learning new skills</Text>
          <Text style={styles.tipsText}>• Physical: Running, gym, yoga, sports</Text>
        </View>
      </ScrollView>

      {/* Mental Edit Modal */}
      <Modal visible={mentalModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setMentalModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>🧠 Edit Mental Challenge</Text>
            
            <Text style={styles.inputLabel}>Challenge Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., LeetCode #234"
              value={mentalTitle}
              onChangeText={setMentalTitle}
            />

            <Text style={styles.inputLabel}>Detail</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Palindrome Linked List"
              value={mentalDetail}
              onChangeText={setMentalDetail}
            />

            <Text style={styles.inputLabel}>Difficulty</Text>
            <View style={styles.difficultyOptions}>
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <TouchableOpacity
                  key={diff}
                  style={[styles.difficultyOption, mentalDifficulty === diff && styles.difficultyOptionSelected]}
                  onPress={() => setMentalDifficulty(diff)}
                >
                  <Text style={[styles.difficultyOptionText, mentalDifficulty === diff && styles.difficultyOptionTextSelected]}>
                    {diff}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setMentalModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveMental}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Physical Edit Modal */}
      <Modal visible={physicalModalVisible} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setPhysicalModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>💪 Edit Physical Challenge</Text>
            
            <Text style={styles.inputLabel}>Activity</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Running"
              value={physicalTitle}
              onChangeText={setPhysicalTitle}
            />

            <Text style={styles.inputLabel}>Target</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 5km"
              value={physicalQuantity}
              onChangeText={setPhysicalQuantity}
            />

            <Text style={styles.inputLabel}>Detail</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 28min pace"
              value={physicalDetail}
              onChangeText={setPhysicalDetail}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setPhysicalModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSavePhysical}>
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
    backgroundColor: '#FEF3C7',
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
  statusBanner: {
    backgroundColor: '#FEF9C3',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  statusBannerDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statusEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  editBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  challengeCard: {
    backgroundColor: '#EDE9FE',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  challengeCardPhysical: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
  },
  challengeCardDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyEasy: {
    backgroundColor: '#DCFCE7',
  },
  difficultyMedium: {
    backgroundColor: '#FEF3C7',
  },
  difficultyHard: {
    backgroundColor: '#FEE2E2',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  quantityBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  challengeDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  streakBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EA580C',
  },
  statusIndicator: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusDone: {
    backgroundColor: '#22C55E',
  },
  statusIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  tipsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 14,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
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
    marginBottom: 16,
  },
  difficultyOptions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  difficultyOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  difficultyOptionSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#8B5CF6',
  },
  difficultyOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  difficultyOptionTextSelected: {
    color: '#7C3AED',
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
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
