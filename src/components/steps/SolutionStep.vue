<template>
  <div class="solution-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">Step 4: Solution Delivery</h3>
        <p class="step-description">
          Based on your answers, here's our recommended solution.
        </p>
      </div>

      <!-- Solution Card -->
      <div v-if="currentSolution" class="solution-card">
        <div class="solution-header">
          <h4 class="solution-title">{{ currentSolution.title }}</h4>
          <div class="priority-badge" :class="priorityClass">
            {{ currentSolution.priority }}
          </div>
        </div>
        
        <p class="solution-description">
          {{ currentSolution.description }}
        </p>
        
        <div class="solution-steps">
          <h5 class="steps-title">Recommended Steps:</h5>
          <ol class="steps-list">
            <li
              v-for="(step, index) in currentSolution.steps"
              :key="index"
              class="step-item"
              v-html="formatStep(step)"
            ></li>
          </ol>
        </div>
      </div>

      <!-- No Solution State -->
      <div v-else class="no-solution">
        <div class="no-solution-icon">🤔</div>
        <h4 class="no-solution-title">Processing Your Information</h4>
        <p class="no-solution-description">
          We're analyzing your responses to provide the best solution.
        </p>
      </div>

      <!-- Feedback Section -->
      <div v-if="currentSolution" class="feedback-section">
        <h4 class="feedback-title">Was this solution helpful?</h4>
        <div class="feedback-buttons">
          <button
            class="feedback-button positive"
            :class="{ active: feedback.helpful === true }"
            @click="handleFeedback(true)"
          >
            <span class="feedback-icon">👍</span>
            <span class="feedback-text">Yes, very helpful</span>
          </button>
          <button
            class="feedback-button negative"
            :class="{ active: feedback.helpful === false }"
            @click="handleFeedback(false)"
          >
            <span class="feedback-icon">👎</span>
            <span class="feedback-text">Not helpful</span>
          </button>
        </div>
      </div>

      <!-- Step Actions -->
      <div class="step-actions">
        <button
          class="restart-button"
          @click="handleRestart"
        >
          Start Over
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import type { Solution } from '@/types/widget'

const emit = defineEmits<{
  feedback: [helpful: boolean]
}>()

const store = useWidgetStore()

// Computed properties
const currentSolution = computed(() => store.currentSolution)
const feedback = computed(() => store.feedback)

const priorityClass = computed(() => {
  if (!currentSolution.value) return ''
  
  switch (currentSolution.value.priority) {
    case 'high':
      return 'priority-high'
    case 'medium':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
    default:
      return ''
  }
})

// Methods
const formatStep = (step: string): string => {
  // Convert markdown-style bold text to HTML
  return step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const handleFeedback = (helpful: boolean) => {
  emit('feedback', helpful)
}

const handleRestart = () => {
  store.reset()
}
</script>

<style scoped>
.solution-step {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

/* Solution Card */
.solution-card {
  background: var(--secondary-color);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e1e5e9;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.solution-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.priority-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-high {
  background: #fef2f2;
  color: #dc2626;
}

.priority-medium {
  background: #fffbeb;
  color: #d97706;
}

.priority-low {
  background: #f0fdf4;
  color: #16a34a;
}

.solution-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.solution-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.steps-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.steps-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.step-item :deep(strong) {
  color: var(--primary-color);
  font-weight: 600;
}

/* No Solution State */
.no-solution {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.no-solution-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-solution-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.no-solution-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* Feedback Section */
.feedback-section {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
}

.feedback-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.feedback-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.feedback-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.feedback-button:hover {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.02);
  transform: translateY(-1px);
}

.feedback-button.active {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.1);
}

.feedback-button.positive.active {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
}

.feedback-button.negative.active {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

.feedback-icon {
  font-size: 24px;
}

.feedback-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

/* Step Actions */
.step-actions {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e1e5e9;
}

.restart-button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restart-button:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

/* Accessibility */
.feedback-button:focus-visible,
.restart-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 480px) {
  .feedback-buttons {
    flex-direction: column;
  }
  
  .feedback-button {
    min-width: auto;
  }
  
  .solution-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style> 