<template>
  <div class="solution-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">Here's your solution</h3>
        <p class="step-description">
          Based on your answers, we've prepared a solution for you.
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
          <h5 class="steps-title">Next steps:</h5>
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
        <div class="no-solution-icon">
          <div class="solution-loading-spinner-container">
            <div class="solution-loading-spinner-ring"></div>
            <div class="solution-loading-spinner-ring"></div>
            <div class="solution-loading-spinner-ring"></div>
          </div>
        </div>
        <h4 class="no-solution-title">Processing Your Information</h4>
        <p class="no-solution-description">
          We're analyzing your responses to provide the best solution.
        </p>

        <div class="solution-progress-container">
          <div class="solution-progress-bar">
            <div class="solution-progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="solution-progress-text">{{ Math.round(progress) }}%</div>
        </div>

        <div class="solution-loading-steps">
          <div class="solution-loading-step" :class="{ active: progress > 25 }">
            <span class="solution-step-icon">●</span>
            <span class="solution-step-text">Analyzing patterns</span>
          </div>
          <div class="solution-loading-step" :class="{ active: progress > 50 }">
            <span class="solution-step-icon">●</span>
            <span class="solution-step-text">Searching solutions</span>
          </div>
          <div class="solution-loading-step" :class="{ active: progress > 75 }">
            <span class="solution-step-icon">●</span>
            <span class="solution-step-text">Preparing solution</span>
          </div>
        </div>
      </div>

      <!-- Feedback Section -->
      <div v-if="currentSolution" class="feedback-section">
        <h4 class="feedback-title">Was this helpful?</h4>
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
          New Question
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWidgetStore } from '@/stores/widget'
import type { Solution } from '@/types/widget'

const emit = defineEmits<{
  feedback: [helpful: boolean]
}>()

const store = useWidgetStore()
const isLoading = ref(true)
const progress = ref(0)

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

// Initialize loading animation when component mounts
onMounted(async () => {
  if (!currentSolution.value) {
    // Simulate solution generation
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += Math.random() * 20 + 10
      }
    }, 300)

    await new Promise(resolve => setTimeout(resolve, 2000))

    clearInterval(progressInterval)
    progress.value = 100

    await new Promise(resolve => setTimeout(resolve, 500))
    isLoading.value = false

    // Generate solution based on user answers
    generateSolution()
  } else {
    isLoading.value = false
  }
})

const generateSolution = () => {
  const answers = store.answers
  const problemDescription = store.problemDescription

  // Analyze answers to generate personalized solution
  let priority = 'medium'
  let title = 'Recommended Solution'
  let description = 'Based on your responses, here\'s our recommended approach:'
  let steps: string[] = []

  // Check device type
  const deviceType = answers.find(a => a.questionId === 'device-type')
  const issueCategory = answers.find(a => a.questionId === 'issue-category')
  const urgency = answers.find(a => a.questionId === 'urgency')
  const additionalInfo = answers.find(a => a.questionId === 'additional-info')
  const budget = answers.find(a => a.questionId === 'budget')

  // Set priority based on urgency
  if (urgency?.value === 'critical') priority = 'high'
  if (urgency?.value === 'high') priority = 'high'
  if (urgency?.value === 'low') priority = 'low'

  // Generate steps based on device and issue type
  if (deviceType?.value === 'computer') {
    steps.push('**Restart your computer** - This resolves many software and performance issues')
    steps.push('**Check for Windows updates** - Ensure your system is up to date')
    steps.push('**Run system diagnostics** - Use built-in troubleshooting tools')
  } else if (deviceType?.value === 'mobile') {
    steps.push('**Restart your device** - Power off and on to clear temporary issues')
    steps.push('**Check for app updates** - Update all applications to latest versions')
    steps.push('**Clear app cache** - Remove temporary files that may cause problems')
  }

  if (issueCategory?.value === 'hardware') {
    steps.push('**Check physical connections** - Ensure all cables and peripherals are properly connected')
    steps.push('**Test with different hardware** - Try alternative devices if available')
    steps.push('**Contact hardware support** - Consider professional repair services')
  } else if (issueCategory?.value === 'software') {
    steps.push('**Update software** - Install latest versions of all applications')
    steps.push('**Check for conflicts** - Disable recently installed software temporarily')
    steps.push('**Reinstall problematic software** - Clean installation may resolve issues')
  } else if (issueCategory?.value === 'network') {
    steps.push('**Check network connection** - Verify internet connectivity')
    steps.push('**Restart router/modem** - Power cycle networking equipment')
    steps.push('**Check firewall settings** - Ensure applications have proper permissions')
  } else if (issueCategory?.value === 'performance') {
    steps.push('**Close unnecessary applications** - Free up system resources')
    steps.push('**Check disk space** - Ensure adequate storage is available')
    steps.push('**Monitor system resources** - Use task manager to identify bottlenecks')
  }

  // Add budget-specific recommendations
  if (budget?.value && Number(budget.value) > 0) {
    steps.push('**Consider professional services** - With your budget, professional support is recommended')
  }

  // Add general troubleshooting steps
  steps.push('**Document the issue** - Keep detailed notes of when problems occur')
  steps.push('**Contact support if needed** - Our team is available for additional assistance')

  const solution: Solution = {
    id: 'generated-solution',
    title,
    description,
    steps,
    priority: priority as 'low' | 'medium' | 'high'
  }

  store.setCurrentSolution(solution)
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
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.solution-loading-spinner-container {
  position: relative;
  width: 50px;
  height: 50px;
}

.solution-loading-spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: solution-spin 1.5s linear infinite;
}

.solution-loading-spinner-ring:nth-child(1) {
  animation-delay: 0s;
}

.solution-loading-spinner-ring:nth-child(2) {
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
  animation-delay: 0.2s;
  animation-duration: 1.2s;
  border-top-color: #7c3aed;
}

.solution-loading-spinner-ring:nth-child(3) {
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  animation-delay: 0.4s;
  animation-duration: 0.9s;
  border-top-color: #a855f7;
}

.no-solution-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.no-solution-description {
  margin: 0 0 24px 0;
  font-size: 14px;
  line-height: 1.5;
}

.solution-progress-container {
  margin-bottom: 24px;
}

.solution-progress-bar {
  width: 100%;
  height: 6px;
  background: #e1e5e9;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.solution-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #7c3aed);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.solution-progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: solution-shimmer 1.5s infinite;
}

.solution-progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  text-align: center;
}

.solution-loading-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.solution-loading-step {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 4px;
  background: #f8f9fa;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.solution-loading-step.active {
  opacity: 1;
  background: rgba(147, 51, 234, 0.1);
  transform: translateX(4px);
}

.solution-step-icon {
  font-size: 10px;
  color: #999;
  transition: color 0.3s ease;
}

.solution-loading-step.active .solution-step-icon {
  color: var(--primary-color);
}

.solution-step-text {
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

@keyframes solution-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes solution-spin {
  to {
    transform: rotate(360deg);
  }
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
