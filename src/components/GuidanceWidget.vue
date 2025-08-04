<template>
  <div 
    class="guidance-widget"
    :class="{ 'widget-open': isOpen, 'widget-embedded': embedded }"
    :style="widgetStyles"
  >
    <!-- Floating Action Button (when embedded and closed) -->
    <div v-if="embedded && !isOpen" class="widget-fab" @click="toggleOpen">
      <div class="fab-icon">?</div>
    </div>

    <!-- Main Widget Container -->
    <div v-if="!embedded || isOpen" class="widget-container">
      <!-- Header -->
      <div class="widget-header">
        <div class="header-content">
          <h2 class="widget-title">Interactive Guidance</h2>
          <p class="widget-subtitle">Let us help you find the perfect solution.</p>
        </div>
        <div class="header-actions">
          <button 
            v-if="embedded" 
            class="close-button" 
            @click="toggleOpen"
            aria-label="Close widget"
          >
            ×
          </button>
          <img 
            v-if="config.logoUrl" 
            :src="config.logoUrl" 
            alt="Logo" 
            class="widget-logo"
          />
        </div>
      </div>

      <!-- Content Area -->
      <div class="widget-content">
        <!-- Problem Description Step -->
        <ProblemDescriptionStep 
          v-if="currentStep === 'problem'"
          @next="handleProblemSubmit"
        />

        <!-- Questions Step -->
        <QuestionsStep 
          v-if="currentStep === 'questions'"
          @next="handleQuestionsComplete"
        />

        <!-- Solution Step -->
        <SolutionStep 
          v-if="currentStep === 'solution'"
          @feedback="handleFeedback"
        />

        <!-- Feedback Step -->
        <FeedbackStep 
          v-if="currentStep === 'feedback'"
          @complete="handleComplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import ProblemDescriptionStep from './steps/ProblemDescriptionStep.vue'
import QuestionsStep from './steps/QuestionsStep.vue'
import SolutionStep from './steps/SolutionStep.vue'
import FeedbackStep from './steps/FeedbackStep.vue'

interface Props {
  embedded?: boolean
  config?: Partial<{
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    fontSize: string
    logoUrl: string
    maxQuestionsBeforeSolution: number
  }>
}

const props = withDefaults(defineProps<Props>(), {
  embedded: false
})

const store = useWidgetStore()

// Apply custom config if provided
onMounted(() => {
  if (props.config) {
    store.updateConfig(props.config)
  }
})

// Computed properties
const isOpen = computed(() => store.isOpen)
const currentStep = computed(() => store.currentStep)
const config = computed(() => store.config)

const widgetStyles = computed(() => ({
  '--primary-color': config.value.primaryColor,
  '--secondary-color': config.value.secondaryColor,
  '--font-family': config.value.fontFamily,
  '--font-size': config.value.fontSize
}))

// Methods
const toggleOpen = () => {
  store.toggleOpen()
}

const handleProblemSubmit = async (description: string) => {
  store.setProblemDescription(description)
  store.setCurrentStep('questions')
  
  // Fetch questions from mock API
  try {
    const response = await store.fetchNextQuestions()
    store.setCurrentQuestions(response.questions)
  } catch (error) {
    console.error('Failed to fetch questions:', error)
  }
}

const handleQuestionsComplete = async () => {
  // Check if we have enough answers to show solution
  if (store.canShowSolution) {
    store.setCurrentStep('solution')
  } else {
    // Continue with more questions or show solution anyway
    store.setCurrentStep('solution')
  }
}

const handleFeedback = (helpful: boolean) => {
  store.setFeedback({ helpful })
  store.setCurrentStep('feedback')
}

const handleComplete = () => {
  // Reset for next session
  store.reset()
  if (props.embedded) {
    store.toggleOpen()
  }
}
</script>

<style scoped>
.guidance-widget {
  --primary-color: #9333ea;
  --secondary-color: #f1f5f9;
  --font-family: Inter, sans-serif;
  --font-size: 16px;
  
  font-family: var(--font-family);
  font-size: var(--font-size);
  position: relative;
  z-index: 1000;
}

.widget-embedded {
  position: fixed;
  bottom: 24px;
  right: 24px;
}

.widget-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 20px;
}

.widget-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.widget-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-width: 400px;
  width: 100%;
  max-height: 75vh;
  display: flex;
  flex-direction: column;
}

.widget-embedded .widget-container {
  width: 400px;
  height: 600px;
}

.widget-header {
  background: var(--primary-color);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-content {
  flex: 1;
}

.widget-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.widget-subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-button {
  background: none;
  border: none;
  color: white;
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

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.widget-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.widget-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .widget-embedded .widget-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 25vh;
    width: 100%;
    height: 75vh;
    border-radius: 12px 12px 0 0;
    max-width: none;
  }
  
  .widget-fab {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
}

/* Accessibility */
.guidance-widget:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Animation */
.widget-container {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 