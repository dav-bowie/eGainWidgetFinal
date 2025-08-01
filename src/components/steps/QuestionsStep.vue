<template>
  <div class="questions-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">Step 1: Answer Questions</h3>
        <p class="step-description">
          Please answer the following questions to help us provide the best solution.
        </p>
      </div>

      <!-- Display Mode Toggle -->
      <div class="display-mode-toggle">
        <button
          class="mode-button"
          :class="{ active: displayMode === 'sequential' }"
          @click="setDisplayMode('sequential')"
        >
          Sequential
        </button>
        <button
          class="mode-button"
          :class="{ active: displayMode === 'batch' }"
          @click="setDisplayMode('batch')"
        >
          Batch
        </button>
      </div>

      <!-- Questions Section -->
      <div class="questions-section">
        <!-- Sequential Mode -->
        <div v-if="displayMode === 'sequential'" class="sequential-questions">
          <div v-if="currentQuestion" class="question-container">
            <QuestionComponent
              :question="currentQuestion"
              :answer="getAnswer(currentQuestion.id)"
              @answer="handleAnswer"
            />
          </div>
          
          <div v-else class="no-questions">
            <p>All questions completed!</p>
          </div>
        </div>

        <!-- Batch Mode -->
        <div v-else class="batch-questions">
          <div
            v-for="question in currentQuestions"
            :key="question.id"
            class="question-container"
          >
            <QuestionComponent
              :question="question"
              :answer="getAnswer(question.id)"
              @answer="handleAnswer"
            />
          </div>
        </div>
      </div>

      <!-- Answered Questions Panel -->
      <div v-if="answeredQuestions.length > 0" class="answered-panel">
        <div class="panel-header">
          <h4 class="panel-title">Answered Questions</h4>
          <span class="answer-count">{{ answeredQuestions.length }}</span>
        </div>
        <div class="answered-list">
          <div
            v-for="question in answeredQuestions"
            :key="question.id"
            class="answered-item"
            @click="editAnswer(question.id)"
          >
            <div class="question-preview">
              <span class="question-text">{{ question.title }}</span>
              <span class="answer-preview">{{ getAnswerDisplay(question.id) }}</span>
            </div>
            <span class="edit-icon">✏️</span>
          </div>
        </div>
      </div>

      <!-- Step Actions -->
      <div class="step-actions">
        <button
          v-if="displayMode === 'sequential' && currentQuestion"
          class="next-button"
          :disabled="!canProceed"
          @click="handleNext"
        >
          Next Question
          <span class="button-icon">→</span>
        </button>
        
        <button
          v-else-if="displayMode === 'batch' || !currentQuestion"
          class="next-button"
          :disabled="!canProceed"
          @click="handleComplete"
        >
          Continue to Solution
          <span class="button-icon">→</span>
        </button>
      </div>
    </div>

    <!-- Edit Answer Modal -->
    <div v-if="editingQuestionId" class="edit-modal-overlay" @click="closeEditModal">
      <div class="edit-modal" @click.stop>
        <div class="modal-header">
          <h4>Edit Answer</h4>
          <button class="close-modal" @click="closeEditModal">×</button>
        </div>
        <div class="modal-content">
          <QuestionComponent
            :question="getQuestionById(editingQuestionId)"
            :answer="getAnswer(editingQuestionId)"
            @answer="handleEditAnswer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import QuestionComponent from './QuestionComponent.vue'
import type { Question, Answer } from '@/types/widget'

const emit = defineEmits<{
  next: []
}>()

const store = useWidgetStore()
const editingQuestionId = ref<string | null>(null)

// Computed properties
const currentQuestions = computed(() => store.currentQuestions)
const answers = computed(() => store.answers)
const displayMode = computed(() => store.displayMode)

const currentQuestion = computed(() => {
  if (displayMode.value === 'sequential') {
    const unanswered = currentQuestions.value.filter(q => 
      !answers.value.some(a => a.questionId === q.id)
    )
    return unanswered[0] || null
  }
  return null
})

const answeredQuestions = computed(() => {
  return currentQuestions.value.filter(q => 
    answers.value.some(a => a.questionId === q.id)
  )
})

const canProceed = computed(() => {
  if (displayMode.value === 'sequential') {
    return currentQuestion.value && getAnswer(currentQuestion.value.id)
  }
  return answeredQuestions.value.length > 0
})

// Methods
const setDisplayMode = (mode: 'sequential' | 'batch') => {
  store.setDisplayMode(mode)
}

const getAnswer = (questionId: string): Answer | null => {
  return answers.value.find(a => a.questionId === questionId) || null
}

const getAnswerDisplay = (questionId: string): string => {
  const answer = getAnswer(questionId)
  if (!answer) return ''
  
  if (answer.label) return answer.label
  return String(answer.value)
}

const getQuestionById = (questionId: string): Question | null => {
  return currentQuestions.value.find(q => q.id === questionId) || null
}

const handleAnswer = async (questionId: string, value: string | number, label?: string) => {
  await store.saveAnswer({
    questionId,
    value,
    label,
    timestamp: new Date()
  })
}

const handleNext = () => {
  // In sequential mode, the next question will be automatically shown
  // as currentQuestion updates when the answer is saved
}

const handleComplete = () => {
  emit('next')
}

const editAnswer = (questionId: string) => {
  editingQuestionId.value = questionId
}

const handleEditAnswer = async (questionId: string, value: string | number, label?: string) => {
  await handleAnswer(questionId, value, label)
  closeEditModal()
}

const closeEditModal = () => {
  editingQuestionId.value = null
}
</script>

<style scoped>
.questions-step {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.step-header {
  text-align: center;
}

.step-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.step-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.display-mode-toggle {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 8px;
  background: var(--secondary-color);
  border-radius: 8px;
}

.mode-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.mode-button.active {
  background: var(--primary-color);
  color: white;
}

.mode-button:hover:not(.active) {
  background: rgba(147, 51, 234, 0.1);
}

.questions-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-container {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
}

.no-questions {
  text-align: center;
  padding: 32px;
  color: #666;
}

.answered-panel {
  background: var(--secondary-color);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.panel-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.answer-count {
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.answered-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answered-item {
  background: white;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.answered-item:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.question-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.question-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.answer-preview {
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 500;
}

.edit-icon {
  font-size: 16px;
  opacity: 0.6;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e1e5e9;
}

.next-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.next-button:hover:not(:disabled) {
  background-color: #7c3aed;
  transform: translateY(-1px);
}

.next-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.button-icon {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.next-button:hover:not(:disabled) .button-icon {
  transform: translateX(2px);
}

/* Edit Modal */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.edit-modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e1e5e9;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-modal {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-modal:hover {
  background-color: #f1f5f9;
}

.modal-content {
  padding: 16px;
  overflow-y: auto;
}

/* Accessibility */
.mode-button:focus-visible,
.next-button:focus-visible,
.close-modal:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style> 