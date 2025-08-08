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

      <!-- Answered Questions Panel - Always visible and positioned higher -->
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
      
      <!-- Empty state for batch mode when no answers yet -->
      <div v-else-if="displayMode === 'batch' && answeredQuestions.length === 0" class="answered-panel empty-state">
        <div class="panel-header">
          <h4 class="panel-title">Your answers</h4>
          <span class="answer-count">0</span>
        </div>
        <div class="empty-message">
          <p>Start answering questions below to see your progress here.</p>
        </div>
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
            v-if="getQuestionById(editingQuestionId)"
            :question="getQuestionById(editingQuestionId)!"
            :answer="getAnswer(editingQuestionId)"
            @answer="handleEditAnswer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch, onMounted } from 'vue'
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

// Watch for current question changes and scroll to it
watch(currentQuestion, (newQuestion) => {
  if (newQuestion && displayMode.value === 'sequential') {
    nextTick(() => {
      scrollToCurrentQuestion()
      // Also ensure the questions section is scrollable
      ensureQuestionsScrollable()
    })
  }
})

// Watch for display mode changes to ensure scrolling works
watch(displayMode, () => {
  nextTick(() => {
    ensureQuestionsScrollable()
  })
})

const answeredQuestions = computed(() => {
  return currentQuestions.value.filter(q =>
    answers.value.some(a => a.questionId === q.id)
  )
})

const canProceed = computed(() => {
  if (displayMode.value === 'sequential') {
    // In sequential mode, can proceed if:
    // 1. There's a current question and it has an answer, OR
    // 2. All questions are answered (no current question but all questions have answers)
    if (currentQuestion.value) {
      const answer = getAnswer(currentQuestion.value.id)
      const canProceedWithCurrent = answer && (answer.value !== null && answer.value !== undefined && answer.value !== '')
      console.log('Sequential mode - current question:', currentQuestion.value.title, 'answer:', answer, 'can proceed:', canProceedWithCurrent)
      return canProceedWithCurrent
    } else {
      // No current question means all questions are answered
      const allAnswered = answeredQuestions.value.length === currentQuestions.value.length
      console.log('Sequential mode - all questions answered:', allAnswered, 'answered:', answeredQuestions.value.length, 'total:', currentQuestions.value.length)
      return allAnswered
    }
  }
  const batchCanProceed = answeredQuestions.value.length > 0
  console.log('Batch mode - can proceed:', batchCanProceed, 'answered:', answeredQuestions.value.length)
  return batchCanProceed
})

// Methods
const setDisplayMode = (mode: 'sequential' | 'batch') => {
  store.setDisplayMode(mode)
  
  // Scroll to top when switching modes for better UX
  nextTick(() => {
    scrollToTop()
  })
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
  
  // Scroll to show the updated answer in the answered panel
  nextTick(() => {
    scrollToAnsweredPanel()
  })
}

const handleNext = async () => {
  // In sequential mode, the next question will be automatically shown
  // as currentQuestion updates when the answer is saved
  // Add a small loading delay for better UX
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isLoading.value = false
  
  // Scroll to the next question after loading
  nextTick(() => {
    if (currentQuestion.value) {
      scrollToCurrentQuestion()
    } else {
      // If no current question, all questions are answered, scroll to top
      scrollToTop()
    }
  })
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
  
  // Scroll to show the updated answer
  nextTick(() => {
    scrollToAnsweredPanel()
  })
}

const closeEditModal = () => {
  editingQuestionId.value = null
}

// Ensure content is scrollable when component mounts
onMounted(() => {
  nextTick(() => {
    // Ensure the questions section is properly scrollable
    const questionsSection = document.querySelector('.questions-section') as HTMLElement
    const stepContent = document.querySelector('.step-content') as HTMLElement
    
    if (questionsSection) {
      questionsSection.style.overflowY = 'auto'
      questionsSection.style.webkitOverflowScrolling = 'touch'
      questionsSection.style.minHeight = '300px'
    }
    
    if (stepContent) {
      stepContent.style.overflowY = 'auto'
      stepContent.style.webkitOverflowScrolling = 'touch'
    }
    
    // Also ensure questions are scrollable
    ensureQuestionsScrollable()
  })
})

// Scrolling methods
const scrollToAnsweredPanel = () => {
  const answeredPanel = document.querySelector('.answered-panel')
  if (answeredPanel) {
    answeredPanel.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })
  }
}

const scrollToCurrentQuestion = () => {
  const currentQuestionElement = document.querySelector('.question-container')
  if (currentQuestionElement) {
    // For mobile, scroll to the top of the question
    currentQuestionElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }
}

const scrollToTop = () => {
  const stepContent = document.querySelector('.step-content')
  if (stepContent) {
    stepContent.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}

// Enhanced scrolling for mobile
const scrollToQuestionOption = (optionElement: Element) => {
  optionElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  })
}

// Auto-scroll when content changes
const autoScrollToContent = () => {
  nextTick(() => {
    const questionsSection = document.querySelector('.questions-section')
    if (questionsSection) {
      questionsSection.scrollTop = 0
    }
  })
}

// Ensure questions section is properly scrollable
const ensureQuestionsScrollable = () => {
  nextTick(() => {
    const questionsSection = document.querySelector('.questions-section') as HTMLElement
    const stepContent = document.querySelector('.step-content') as HTMLElement
    
    if (questionsSection) {
      questionsSection.style.overflowY = 'auto'
      questionsSection.style.webkitOverflowScrolling = 'touch'
      questionsSection.style.minHeight = '300px'
    }
    
    if (stepContent) {
      stepContent.style.overflowY = 'auto'
      stepContent.style.webkitOverflowScrolling = 'touch'
    }
  })
}
</script>

<style scoped>
.questions-step {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
  /* Ensure proper mobile layout */
  overflow: hidden;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Ensure content doesn't overflow on mobile */
  padding-bottom: 0;
  /* Ensure proper ordering of elements */
  align-items: stretch;
  /* Smooth scrolling behavior */
  scroll-behavior: smooth;
  /* Prevent scroll chaining */
  overscroll-behavior: contain;
}

.step-header {
  text-align: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.step-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Display Mode Toggle */
.display-mode-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.mode-button {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
}

.mode-button:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.mode-button.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: #6366f1;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Questions Section */
.questions-section {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Ensure proper scrolling on mobile */
  overscroll-behavior: contain;
  /* Allow content to expand properly */
  min-height: 300px;
  /* Ensure it takes remaining space after answered panel */
  display: flex;
  flex-direction: column;
}

.sequential-questions,
.batch-questions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Ensure current question is always visible */
  flex: 1;
  /* Allow content to expand and be scrollable */
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.question-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-container:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.no-questions {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
}

.no-questions p {
  font-size: 16px;
  margin: 0;
}

/* Answered Questions Panel */
.answered-panel {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  margin-top: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
  /* Compact design - positioned higher in layout */
  max-height: 120px;
  overflow-y: auto;
  /* Ensure it's always visible */
  order: -1;
  /* Smooth scrolling for answered panel */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  /* Prevent scroll chaining */
  overscroll-behavior: contain;
  /* Smooth transition when content changes */
  transition: max-height 0.3s ease;
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
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  /* More compact for desktop */
  margin-bottom: 4px;
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
  font-size: 13px;
  font-weight: 500;
  color: #333;
  /* Truncate long questions */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.answer-preview {
  font-size: 11px;
  color: var(--primary-color);
  font-weight: 500;
  /* Truncate long answers */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.edit-icon {
  font-size: 16px;
  opacity: 0.6;
}

/* Empty state styling */
.answered-panel.empty-state {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.empty-message {
  text-align: center;
  padding: 16px;
  color: #64748b;
}

.empty-message p {
  margin: 0;
  font-size: 13px;
  font-style: italic;
}

/* Step Actions */
.step-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e1e5e9;
  flex-shrink: 0;
  /* Ensure actions stay at bottom */
  margin-top: auto;
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
  /* Improve touch targets on mobile */
  min-height: 44px;
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
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Edit Modal */
.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.edit-modal {
  background: white;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.close-modal {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #64748b;
  transition: all 0.2s ease;
}

.close-modal:hover {
  background: #e2e8f0;
  color: #374151;
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
}

/* Desktop Optimizations */
@media (min-width: 769px) {
  .questions-step {
    /* Ensure proper height on desktop */
    height: 100%;
    max-height: 100%;
  }

  .step-content {
    /* Optimize spacing for desktop */
    gap: 16px;
    height: 100%;
  }

  .questions-section {
    /* Ensure questions get priority space */
    flex: 1;
    min-height: 250px;
  }

  .answered-panel {
    /* More compact on desktop - positioned higher */
    max-height: 100px;
    padding: 8px;
    margin-top: 4px;
    margin-bottom: 8px;
    /* Ensure it's always visible at top */
    order: -1;
  }

  .answered-item {
    padding: 4px 8px;
    margin-bottom: 2px;
  }

  .question-text,
  .answer-preview {
    max-width: 250px;
  }
}

/* Responsive Design - Mobile Optimizations */
@media (max-width: 768px) {
  .questions-step {
    padding: 16px;
    /* Ensure proper scrolling on mobile */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    /* Allow content to expand and be scrollable */
    height: auto;
    min-height: 100%;
    max-height: none;
    /* Enable scrolling for the entire container */
    overflow-y: auto;
  }

  .step-content {
    gap: 16px;
    /* Ensure proper scrolling on mobile */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    /* Allow content to expand */
    height: auto;
    min-height: 100%;
    overflow-y: auto;
    /* Ensure content is scrollable */
    min-height: 0;
  }

  /* Ensure questions section is scrollable */
  .questions-section {
    flex: 1 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    /* Ensure proper spacing for mobile */
    padding-bottom: 20px !important;
    /* Allow content to expand */
    height: auto !important;
    min-height: 300px !important;
    /* Force scrolling to work */
    display: flex !important;
    flex-direction: column !important;
  }

  /* Make answered panel more compact on mobile */
  .answered-panel {
    max-height: 100px;
    margin-bottom: 16px;
  }

  /* Ensure question containers are fully visible */
  .question-container {
    margin-bottom: 16px;
    /* Ensure proper spacing */
    padding: 16px;
    /* Allow content to expand */
    height: auto;
  }

  /* Scale down elements for mobile while keeping same features */
  .step-title {
    font-size: 18px;
  }

  .step-description {
    font-size: 13px;
  }

  .mode-button {
    padding: 10px 14px;
    font-size: 13px;
  }

  .next-button {
    padding: 12px 20px;
    font-size: 14px;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .questions-step {
    padding: 12px;
    height: auto;
    min-height: 100%;
    max-height: none;
    overflow-y: auto;
  }

  .step-content {
    gap: 12px;
    height: auto;
    min-height: 100%;
    overflow-y: auto;
  }

  /* Ensure questions section is scrollable on small screens */
  .questions-section {
    flex: 1 !important;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch !important;
    padding-bottom: 20px !important;
    /* Allow content to expand */
    height: auto !important;
    min-height: 250px !important;
    /* Force scrolling to work */
    display: flex !important;
    flex-direction: column !important;
  }

  /* Make answered panel even more compact */
  .answered-panel {
    max-height: 80px;
    margin-bottom: 12px;
  }

  /* Ensure question containers are fully visible */
  .question-container {
    margin-bottom: 12px;
    padding: 12px;
    /* Allow content to expand */
    height: auto;
  }

  /* Further scale down for extra small devices */
  .step-title {
    font-size: 16px;
  }

  .step-description {
    font-size: 12px;
  }

  .mode-button {
    padding: 8px 12px;
    font-size: 12px;
  }

  .next-button {
    padding: 10px 16px;
    font-size: 13px;
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
