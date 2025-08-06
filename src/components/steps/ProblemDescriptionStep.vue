<template>
  <div class="problem-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">How can we help you?</h3>
        <p class="step-description">
          Describe your issue and we'll guide you to the best solution.
        </p>
      </div>

      <!-- Suggested Prompts Section -->
      <div class="suggestions-section">
        <h4 class="suggestions-title">Quick options</h4>
        <div class="suggestions-grid">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="suggestion-button"
            @click="selectSuggestion(suggestion.text)"
          >
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <span class="suggestion-text">{{ suggestion.text }}</span>
          </button>
        </div>
      </div>

      <div class="input-section">
        <label for="problem-description" class="input-label">
          Tell us more
        </label>
        <textarea
          id="problem-description"
          v-model="description"
          class="problem-textarea"
          placeholder="Describe your issue here..."
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

// Suggested prompts similar to Meta AI
const suggestions = ref([
  {
    id: 1,
    icon: '🔧',
    text: 'I need help with technical support'
  },
  {
    id: 2,
    icon: '📚',
    text: 'How to use the knowledge base'
  },
  {
    id: 3,
    icon: '💬',
    text: 'Customer service automation'
  },
  {
    id: 4,
    icon: '📊',
    text: 'Analytics and reporting issues'
  }
])

const isValid = computed(() => {
  return description.value.trim().length >= 10
})

const selectSuggestion = (suggestionText: string) => {
  description.value = suggestionText
}

const handleSubmit = () => {
  if (isValid.value) {
    emit('next', description.value.trim())
  }
}
</script>

<style scoped>
.problem-step {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

/* Suggestions Section */
.suggestions-section {
  margin-bottom: 16px;
}

.suggestions-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

/* Responsive design for suggestions */
@media (max-width: 480px) {
  .suggestions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .suggestion-button {
    padding: 10px;
    min-height: 70px;
  }

  .suggestion-icon {
    font-size: 18px;
  }

  .suggestion-text {
    font-size: 11px;
  }
}

.suggestion-button {
  background: #f8fafc;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  min-height: 90px;
}

.suggestion-button:hover {
  background: #f1f5f9;
  border-color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.1);
}

.suggestion-icon {
  font-size: 20px;
  line-height: 1;
}

.suggestion-text {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  line-height: 1.3;
}

.suggestion-button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
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
  min-height: 150px;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 16px;
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
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 140px;
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
