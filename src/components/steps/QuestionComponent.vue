<template>
  <div class="question-component">
    <div class="question-header">
      <h4 class="question-title">{{ question.title }}</h4>
      <p v-if="question.description" class="question-description">
        {{ question.description }}
      </p>
      <span v-if="question.required" class="required-indicator">*</span>
    </div>

    <!-- Text Choices -->
    <div v-if="question.type === 'text-choices'" class="text-choices">
      <div class="options-grid">
        <label
          v-for="option in question.options"
          :key="option.id"
          class="option-item"
          :class="{ selected: isSelected(option.id) }"
        >
          <input
            type="radio"
            :name="question.id"
            :value="option.id"
            :checked="isSelected(option.id)"
            @change="handleTextChoice(option.id, option.label)"
            class="radio-input"
          />
          <div class="option-content">
            <div class="radio-custom"></div>
            <span class="option-label">{{ option.label }}</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Image Choices -->
    <div v-else-if="question.type === 'image-choices'" class="image-choices">
      <div class="image-grid">
        <label
          v-for="option in question.options"
          :key="option.id"
          class="image-option"
          :class="{ selected: isSelected(option.id) }"
        >
          <input
            type="radio"
            :name="question.id"
            :value="option.id"
            :checked="isSelected(option.id)"
            @change="handleImageChoice(option.id, option.label)"
            class="radio-input"
          />
          <div class="image-container">
            <img
              v-if="option.image"
              :src="option.image"
              :alt="option.label"
              class="option-image"
            />
            <div v-else class="image-placeholder">
              {{ option.label.charAt(0) }}
            </div>
          </div>
          <span class="image-label">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <!-- Free Text -->
    <div v-else-if="question.type === 'free-text'" class="free-text">
      <div class="text-input-container">
        <textarea
          v-model="localTextValue"
          @input="handleTextInput"
          @keydown="handleTextKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          class="text-input"
          :class="{ focused: isFocused }"
          :placeholder="question.description || 'Enter your answer...'"
          rows="3"
          ref="textAreaRef"
        ></textarea>
        <div class="input-border"></div>
      </div>
      <div class="text-input-actions">
        <div class="character-count" :class="{ 'near-limit': localTextValue.length > 800 }">
          {{ localTextValue.length }}/1000 characters
        </div>
        <button
          @click="handleTextSubmit"
          class="submit-button"
          :disabled="!localTextValue.trim()"
        >
          <span class="submit-icon">→</span>
          <span class="submit-text">Send</span>
        </button>
      </div>
    </div>

    <!-- Numeric -->
    <div v-else-if="question.type === 'numeric'" class="numeric-input">
      <div class="number-input-container">
        <input
          type="number"
          :value="getNumericValue()"
          @input="handleNumericInput"
          @focus="handleFocus"
          @blur="handleBlur"
          class="number-input"
          :class="{ focused: isFocused }"
          :placeholder="question.description || 'Enter a number...'"
          :min="question.validation?.min"
          :max="question.validation?.max"
          step="1"
        />
        <div class="input-border"></div>
      </div>
      <div v-if="question.validation" class="validation-info">
        <span v-if="question.validation.min !== undefined">
          Min: {{ question.validation.min }}
        </span>
        <span v-if="question.validation.max !== undefined">
          Max: {{ question.validation.max }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import type { Question, Answer } from '@/types/widget'

interface Props {
  question: Question
  answer: Answer | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answer: [questionId: string, value: string | number, label?: string]
}>()

// Reactive state
const isFocused = ref(false)
const textAreaRef = ref<HTMLTextAreaElement>()
const localTextValue = ref(props.answer?.value?.toString() || '')

// Computed
const isSelected = (optionId: string): boolean => {
  return props.answer?.value === optionId
}

// const getTextValue = (): string => {
//   return props.answer?.value?.toString() || ''
// }

const getNumericValue = (): number | '' => {
  if (props.answer?.value !== undefined && props.answer?.value !== null) {
    return Number(props.answer.value)
  }
  return ''
}

// Methods
const handleTextChoice = (optionId: string, label: string) => {
  emit('answer', props.question.id, optionId, label)
  
  // Smooth scroll to show the selection
  nextTick(() => {
    const selectedElement = document.querySelector(`input[value="${optionId}"]`)
    if (selectedElement) {
      const optionItem = selectedElement.closest('.option-item')
      if (optionItem) {
        // Scroll the option into view within the options grid
        const optionsGrid = optionItem.closest('.options-grid')
        if (optionsGrid) {
          const gridRect = optionsGrid.getBoundingClientRect()
          const itemRect = optionItem.getBoundingClientRect()
          
          if (itemRect.bottom > gridRect.bottom || itemRect.top < gridRect.top) {
            optionItem.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            })
          }
        }
      }
    }
  })
}

const handleImageChoice = (optionId: string, label: string) => {
  emit('answer', props.question.id, optionId, label)
  
  // Smooth scroll to show the selection
  nextTick(() => {
    const selectedElement = document.querySelector(`input[value="${optionId}"]`)
    if (selectedElement) {
      selectedElement.closest('.image-option')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  })
}

const handleTextInput = () => {
  // Auto-resize textarea
  nextTick(() => {
    if (textAreaRef.value) {
      textAreaRef.value.style.height = 'auto'
      textAreaRef.value.style.height = `${textAreaRef.value.scrollHeight}px`
    }
  })
}

const handleTextSubmit = () => {
  emit('answer', props.question.id, localTextValue.value)
}

const handleTextKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleTextSubmit()
  }
}

const handleNumericInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? '' : Number(target.value)

  // Validate numeric input
  if (value !== '' && props.question.validation) {
    const numValue = Number(value)
    if (props.question.validation.min !== undefined && numValue < props.question.validation.min) {
      return
    }
    if (props.question.validation.max !== undefined && numValue > props.question.validation.max) {
      return
    }
  }

  emit('answer', props.question.id, value)
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

// Watch for prop changes and update local state
watch(() => props.answer?.value, (newValue) => {
  localTextValue.value = newValue?.toString() || ''
})
</script>

<style scoped>
.question-component {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-component:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.question-header {
  margin-bottom: 24px;
}

.question-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.question-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.required-indicator {
  color: #ef4444;
  font-weight: 600;
  margin-left: 4px;
}

/* Text Choices */
.text-choices {
  margin-bottom: 16px;
}

.options-grid {
  display: grid;
  gap: 12px;
  /* Ensure options are scrollable when there are many options */
  max-height: none;
  overflow: visible;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  /* Add padding to account for scrollbar */
  padding-right: 8px;
  /* Force proper grid layout */
  grid-template-columns: 1fr;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.option-item:hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-1px);
}

.option-item.selected {
  border-color: #6366f1;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.radio-input {
  display: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.option-item:hover .radio-custom {
  border-color: #6366f1;
}

.option-item.selected .radio-custom {
  border-color: white;
  background: white;
}

.option-item.selected .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
}

.option-label {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  transition: color 0.2s ease;
}

.option-item.selected .option-label {
  color: white;
}

/* Image Choices */
.image-choices {
  margin-bottom: 16px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.image-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  text-align: center;
}

.image-option:hover {
  border-color: #6366f1;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15);
}

.image-option.selected {
  border-color: #6366f1;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.image-container {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #64748b;
}

.image-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: color 0.2s ease;
}

.image-option.selected .image-label {
  color: white;
}

/* Free Text */
.free-text {
  margin-bottom: 16px;
}

.text-input-container {
  position: relative;
}

.text-input {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.text-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.text-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.input-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.text-input:focus + .input-border {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.character-count {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 8px;
  text-align: right;
  transition: color 0.2s ease;
}

.character-count.near-limit {
  color: #f59e0b;
}

.text-input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.submit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 80px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.submit-button:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.submit-icon {
  font-size: 16px;
  transition: transform 0.2s ease;
}

.submit-button:hover:not(:disabled) .submit-icon {
  transform: translateX(2px);
}

.submit-text {
  font-weight: 600;
}

/* Numeric Input */
.numeric-input {
  margin-bottom: 16px;
}

.number-input-container {
  position: relative;
}

.number-input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.number-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.number-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.validation-info {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
}

/* Responsive Design */
@media (max-width: 768px) {
  .question-component {
    padding: 16px;
    /* Ensure proper scrolling on mobile */
    overflow: visible;
  }

  .question-header {
    margin-bottom: 20px;
  }

  .question-title {
    font-size: 16px;
    line-height: 1.3;
  }

  .question-description {
    font-size: 13px;
  }

  .options-grid {
    gap: 10px;
    /* Enhanced scrolling for mobile */
    max-height: none !important;
    overflow: visible !important;
    -webkit-overflow-scrolling: touch !important;
    overscroll-behavior: contain !important;
    /* Ensure proper spacing */
    padding-right: 4px !important;
    /* Force scrolling to work */
    display: grid !important;
    grid-template-columns: 1fr !important;
  }

  .option-item {
    padding: 14px;
    /* Ensure options are fully visible */
    min-height: 48px;
  }

  .image-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .image-option {
    padding: 12px;
    /* Ensure image options are fully visible */
    min-height: 80px;
  }

  .image-container {
    width: 40px;
    height: 40px;
  }

  .text-input {
    min-height: 80px;
    padding: 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .number-input {
    padding: 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  /* Ensure proper spacing for mobile */
  .text-input-actions {
    margin-top: 12px;
  }

  .submit-button {
    min-height: 44px;
    padding: 12px 16px;
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .question-component {
    padding: 12px;
  }

  .options-grid {
    /* Even more compact for small screens */
    max-height: none !important;
    gap: 8px !important;
    overflow: visible !important;
    -webkit-overflow-scrolling: touch !important;
    overscroll-behavior: contain !important;
    /* Force scrolling to work */
    display: grid !important;
    grid-template-columns: 1fr !important;
  }

  .option-item {
    padding: 12px;
    min-height: 44px;
  }

  .question-title {
    font-size: 15px;
  }

  .option-label {
    font-size: 14px;
  }
}

/* Animation for focus states */
@keyframes focusPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.text-input:focus,
.number-input:focus {
  animation: focusPulse 0.3s ease-out;
}
</style>
