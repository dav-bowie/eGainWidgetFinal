<template>
  <div class="problem-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">Step 0: Problem Statement</h3>
        <p class="step-description">
          Describe the problem you're trying to solve. Be as detailed as possible to help us provide the best solution.
        </p>
      </div>

      <div class="input-section">
        <label for="problem-description" class="input-label">
          Problem Description
        </label>
        <textarea
          id="problem-description"
          v-model="description"
          class="problem-textarea"
          placeholder="Tell us about the issue you're experiencing..."
          rows="4"
          maxlength="500"
          @keydown.enter.prevent="handleSubmit"
        ></textarea>
        <div class="character-count">
          {{ description.length }}/500 characters
        </div>
      </div>

      <div class="step-actions">
        <button
          class="next-button"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Continue
          <span class="button-icon">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  next: [description: string]
}>()

const description = ref('')

const isValid = computed(() => {
  return description.value.trim().length >= 10
})

const handleSubmit = () => {
  if (isValid.value) {
    emit('next', description.value.trim())
  }
}
</script>

<style scoped>
.problem-step {
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

.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.problem-textarea {
  flex: 1;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.problem-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.problem-textarea::placeholder {
  color: #999;
}

.character-count {
  font-size: 12px;
  color: #666;
  text-align: right;
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

/* Accessibility */
.problem-textarea:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.next-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style> 