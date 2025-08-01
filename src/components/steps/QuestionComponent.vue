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
          <span class="option-label">{{ option.label }}</span>
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
      <textarea
        :value="getTextValue()"
        @input="handleTextInput"
        class="text-input"
        :placeholder="question.description || 'Enter your answer...'"
        rows="3"
        maxlength="1000"
      ></textarea>
      <div class="character-count">
        {{ getTextValue().length }}/1000 characters
      </div>
    </div>

    <!-- Numeric -->
    <div v-else-if="question.type === 'numeric'" class="numeric-input">
      <input
        type="number"
        :value="getNumericValue()"
        @input="handleNumericInput"
        class="number-input"
        :placeholder="question.description || 'Enter a number...'"
        :min="question.validation?.min"
        :max="question.validation?.max"
        step="1"
      />
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
import { computed } from 'vue'
import type { Question, Answer } from '@/types/widget'

interface Props {
  question: Question
  answer: Answer | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answer: [questionId: string, value: string | number, label?: string]
}>()

// Computed
const isSelected = (optionId: string): boolean => {
  return props.answer?.value === optionId
}

const getTextValue = (): string => {
  return props.answer?.value?.toString() || ''
}

const getNumericValue = (): number | '' => {
  if (props.answer?.value !== undefined && props.answer?.value !== null) {
    return Number(props.answer.value)
  }
  return ''
}

// Methods
const handleTextChoice = (optionId: string, label: string) => {
  emit('answer', props.question.id, optionId, label)
}

const handleImageChoice = (optionId: string, label: string) => {
  emit('answer', props.question.id, optionId, label)
}

const handleTextInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('answer', props.question.id, target.value)
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
</script>

<style scoped>
.question-component {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-header {
  position: relative;
}

.question-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.question-description {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.required-indicator {
  color: #dc2626;
  font-weight: bold;
  margin-left: 4px;
}

/* Text Choices */
.text-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.option-item:hover {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.02);
}

.option-item.selected {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.1);
}

.radio-input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary-color);
}

.option-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex: 1;
}

/* Image Choices */
.image-choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.image-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
}

.image-option:hover {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.02);
}

.image-option.selected {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.1);
}

.image-container {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  overflow: hidden;
}

.option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.image-label {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  text-align: center;
  line-height: 1.2;
}

/* Free Text */
.free-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-input {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.text-input::placeholder {
  color: #999;
}

.character-count {
  font-size: 12px;
  color: #666;
  text-align: right;
}

/* Numeric Input */
.numeric-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.number-input {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.number-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.number-input::placeholder {
  color: #999;
}

.validation-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

/* Accessibility */
.option-item:focus-within,
.image-option:focus-within,
.text-input:focus-visible,
.number-input:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 480px) {
  .image-grid {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  }
  
  .image-container {
    width: 48px;
    height: 48px;
  }
  
  .image-placeholder {
    font-size: 18px;
  }
}
</style> 