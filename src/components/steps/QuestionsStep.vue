<template>
  <div class="questions-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">A few quick questions</h3>
        <p class="step-description">
          Help us understand your needs better.
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
          <h4 class="panel-title">Your answers</h4>
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
            :disabled="!canProceed || isLoading"
            @click="handleNext"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Processing...' : 'Next' }}
            <span v-if="!isLoading" class="button-icon">→</span>
          </button>

          <button
            v-else-if="displayMode === 'batch' || !currentQuestion"
            class="next-button"
            :disabled="!canProceed || isLoading"
            @click="handleComplete"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            {{ isLoading ? 'Processing...' : 'Get Solution' }}
            <span v-if="!isLoading" class="button-icon">→</span>
          </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-icon">
          <div class="loading-spinner-container">
            <div class="loading-spinner-ring"></div>
            <div class="loading-spinner-ring"></div>
            <div class="loading-spinner-ring"></div>
          </div>
        </div>
        <h3 class="loading-title">Processing your information...</h3>
        <p class="loading-description">Analyzing your responses to generate a personalized solution.</p>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">{{ Math.round(progress) }}%</div>
        </div>

        <div class="loading-steps">
          <div class="loading-step" :class="{ active: progress > 20 }">
            <span class="step-icon">●</span>
            <span class="step-text">Analyzing patterns</span>
          </div>
          <div class="loading-step" :class="{ active: progress > 40 }">
            <span class="step-icon">●</span>
            <span class="step-text">Searching solutions</span>
          </div>
          <div class="loading-step" :class="{ active: progress > 60 }">
            <span class="step-icon">●</span>
            <span class="step-text">Finding best match</span>
          </div>
          <div class="loading-step" :class="{ active: progress > 80 }">
            <span class="step-icon">●</span>
            <span class="step-text">Preparing solution</span>
          </div>
        </div>
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
const isLoading = ref(false)
const progress = ref(0)

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

const handleNext = async () => {
  // In sequential mode, the next question will be automatically shown
  // as currentQuestion updates when the answer is saved
  // Add a small loading delay for better UX
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isLoading.value = false
}

const handleComplete = async () => {
  isLoading.value = true
  progress.value = 0

  // Simulate progress bar animation
  const progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15 + 5 // Random increment between 5-20
    }
  }, 200)

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2500))

  clearInterval(progressInterval)
  progress.value = 100

  // Small delay to show 100% completion
  await new Promise(resolve => setTimeout(resolve, 300))

  isLoading.value = false
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

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

/* Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  backdrop-filter: blur(2px);
  border-radius: 12px;
}

.loading-content {
  text-align: center;
  max-width: 350px;
  padding: 32px 20px;
}

.loading-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.loading-spinner-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.loading-spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.loading-spinner-ring:nth-child(1) {
  animation-delay: 0s;
}

.loading-spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation-delay: 0.2s;
  animation-duration: 1.2s;
  border-top-color: #7c3aed;
}

.loading-spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation-delay: 0.4s;
  animation-duration: 0.9s;
  border-top-color: #a855f7;
}

.loading-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.loading-description {
  margin: 0 0 32px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.progress-container {
  margin-bottom: 32px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e1e5e9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #7c3aed);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
}

.loading-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-step {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f8f9fa;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.loading-step.active {
  opacity: 1;
  background: rgba(147, 51, 234, 0.1);
  transform: translateX(8px);
}

.step-icon {
  font-size: 12px;
  color: #999;
  transition: color 0.3s ease;
}

.loading-step.active .step-icon {
  color: var(--primary-color);
}

.step-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Accessibility */
.mode-button:focus-visible,
.next-button:focus-visible,
.close-modal:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>
