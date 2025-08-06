<template>
  <div class="problem-step">
    <div class="step-content">
      <div class="chat-messages">
        <div class="message ai-message">
          <div class="message-avatar">
            <div class="ai-avatar">🤖</div>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p class="message-text">Hi! I'm your AI guidance assistant. Please describe the problem you're trying to solve, and I'll help you find the best solution.</p>
            </div>
            <div class="message-time">{{ formatTime(new Date()) }}</div>
          </div>
        </div>
      </div>

      <!-- Suggested Prompts Section -->
      <div class="suggestions-section">
        <h4 class="suggestions-title">Quick options</h4>
        <div class="suggestions-grid">
          <button
            v-for="suggestion in suggestions"
            :key="suggestion.id"
            class="suggestion-button"
            :class="{ active: isSuggestionActive(suggestion.text) }"
            @click="selectSuggestion(suggestion.text)"
          >
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <span class="suggestion-text">{{ suggestion.text }}</span>
          </button>
        </div>
      </div>

      <div class="chat-input-section">
        <div class="chat-input-container">
          <textarea
            id="problem-description"
            v-model="description"
            class="chat-textarea"
            :class="{ focused: isFocused, typing: isTyping }"
            placeholder="Describe your problem or ask a question..."
            rows="2"
            @keydown="handleKeydown"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput"
            ref="textareaRef"
          ></textarea>
          <button
            @click="handleSubmit"
            class="send-button"
            :disabled="!isValid"
            :class="{ active: isValid }"
          >
            <span class="send-icon">→</span>
          </button>
        </div>
        <div class="typing-indicator" v-if="isTyping">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const emit = defineEmits<{
  next: [description: string]
}>()

const description = ref('')
const isFocused = ref(false)
const isTyping = ref(false)
const typingTimeout = ref<number | null>(null)
const textareaRef = ref<HTMLTextAreaElement>()

// Suggested prompts for company policy inquiries
const suggestions = ref([
  {
    id: 1,
    icon: '💰',
    text: 'I want to know about refund policies'
  },
  {
    id: 2,
    icon: '🛡️',
    text: 'What is the warranty coverage?'
  },
  {
    id: 3,
    icon: '📞',
    text: 'Support hours and response times'
  },
  {
    id: 4,
    icon: '⚡',
    text: 'Service level agreement details'
  }
])

const isValid = computed(() => {
  return description.value.trim().length >= 10
})

const isSuggestionActive = (suggestionText: string): boolean => {
  return description.value.trim() === suggestionText
}

const selectSuggestion = (suggestionText: string) => {
  description.value = suggestionText
  handleInput()
}

const handleInput = () => {
  // Auto-resize textarea
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
    }
  })

  // Show typing indicator
  isTyping.value = true

  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  // Hide typing indicator after 1 second of no typing
  typingTimeout.value = window.setTimeout(() => {
    isTyping.value = false
  }, 1000)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
  isTyping.value = false
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
}

const handleSubmit = () => {
  if (isValid.value) {
    emit('next', description.value.trim())
  }
}
</script>

<style scoped>
.problem-step {
  padding: 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}



/* Chat Messages */
.chat-messages {
  margin-bottom: 24px;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-avatar {
  flex-shrink: 0;
}

.ai-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.message-content {
  flex: 1;
  max-width: calc(100% - 48px);
}

.message-bubble {
  background: #f1f5f9;
  border-radius: 18px;
  padding: 12px 16px;
  margin-bottom: 4px;
}

.message-text {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-left: 4px;
}

/* Chat Input */
.chat-input-section {
  margin-top: auto;
}

.chat-input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  padding: 12px 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chat-input-container:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.chat-textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  background: transparent;
  color: #1e293b;
  min-height: 20px;
  max-height: 120px;
}

.chat-textarea::placeholder {
  color: #94a3b8;
}

.send-button {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.send-button.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  cursor: pointer;
}

.send-button.active:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.send-icon {
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.send-button.active:hover .send-icon {
  transform: translateX(2px);
}

/* Suggestions Section */
.suggestions-section {
  margin-bottom: 8px;
}

.suggestions-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.suggestion-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  font-family: inherit;
  font-size: 14px;
  color: #374151;
}

.suggestion-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.suggestion-button.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: #6366f1;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.suggestion-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.suggestion-text {
  font-weight: 500;
  line-height: 1.4;
}



.typing-indicator {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 8px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .problem-step {
    padding: 20px;
  }

  .step-content {
    gap: 24px;
  }

  .step-title {
    font-size: 20px;
  }

  .step-description {
    font-size: 14px;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .suggestion-button {
    padding: 14px 16px;
    font-size: 13px;
  }

  .problem-textarea {
    min-height: 100px;
    padding: 16px;
    font-size: 15px;
  }

  .next-button {
    padding: 14px 24px;
    font-size: 15px;
    min-width: 120px;
  }
}

/* Animation for focus states */
@keyframes focusPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  100% { transform: scale(1); }
}

.problem-textarea:focus {
  animation: focusPulse 0.3s ease-out;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
