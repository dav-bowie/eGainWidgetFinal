<template>
  <!-- Floating Action Button (when embedded and closed) -->
  <div v-if="embedded && !isOpen" class="chat-widget-fab" @click="toggleOpen">
    <img
      v-if="config.logoUrl && config.logoUrl !== '/placeholder.svg'"
      :src="config.logoUrl"
      alt="Logo"
      class="fab-logo"
    />
    <div v-else class="fab-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
      </svg>
    </div>
  </div>

  <!-- Main Chat Widget Container -->
  <div
    v-if="!embedded || isOpen"
    class="chat-widget"
    :class="{ 'chat-widget-open': isOpen, 'chat-widget-embedded': embedded }"
    :style="widgetStyles"
  >
    <div
      class="chat-widget-container"
      :class="{ 'dragging': isDragging }"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
    >
      <!-- Header -->
      <div class="chat-widget-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
            </svg>
          </div>
          <div class="header-text">
            <h2 class="chat-widget-title">AI Guidance Assistant</h2>
            <p class="chat-widget-subtitle">Powered by eGain</p>
          </div>
        </div>
        <div class="header-actions">
          <!-- Admin Settings Button -->
          <button
            class="admin-button"
            @click="showAdminPanel"
            aria-label="Admin settings"
            title="Admin settings"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2579 9.77251 19.9887C9.5799 19.7195 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74206 9.96512 4.01128 9.77251C4.2805 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <button
            v-if="embedded"
            class="minimize-button"
            @click="toggleOpen"
            aria-label="Minimize widget"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div class="chat-messages" ref="messagesContainer">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-avatar" v-if="message.type === 'assistant'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <div v-if="message.type === 'assistant'" v-html="message.content"></div>
              <div v-else>{{ message.content }}</div>
            </div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="isTyping" class="message assistant">
          <div class="message-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9ZM19 9H14V4H5V21H19V9Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="message-bubble typing">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="input-container">
          <textarea
            v-model="userInput"
            @keydown.enter.prevent="sendMessage"
            @keydown.enter.shift.exact="sendMessage"
            placeholder="Describe your problem or ask a question..."
            class="chat-input"
            rows="1"
            ref="inputRef"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isTyping"
            class="send-button"
            :class="{ 'disabled': !userInput.trim() || isTyping }"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Admin Panel Modal -->
    <div v-if="showAdminModal" class="admin-modal-overlay" @click="closeAdminModal">
      <div class="admin-modal" @click.stop>
        <!-- Password Screen -->
        <div v-if="!isAdminAuthenticated" class="admin-password-screen">
          <h3 class="admin-modal-title">Admin Access</h3>
          <p class="admin-modal-subtitle">Enter password to access admin settings</p>

          <div class="password-input-group">
            <input
              v-model="adminPassword"
              @keydown.enter="authenticateAdmin"
              type="password"
              placeholder="Enter password"
              class="password-input"
              ref="passwordInput"
            />
            <button @click="authenticateAdmin" class="password-submit-btn">
              Access
            </button>
          </div>
          <p v-if="passwordError" class="password-error">{{ passwordError }}</p>
          <p class="password-hint">💡 Hint: admin123</p>
        </div>

        <!-- Admin Settings Screen -->
        <div v-else class="admin-settings-screen">
          <div class="admin-header">
            <h3 class="admin-modal-title">Widget Settings</h3>
            <button @click="closeAdminModal" class="close-admin-btn">×</button>
          </div>

          <div class="admin-content">
            <!-- Color Settings -->
            <div class="setting-group">
              <h4>Colors</h4>
              <div class="color-settings">
                <div class="color-input">
                  <label>Primary Color</label>
                  <input
                    v-model="adminConfig.primaryColor"
                    type="color"
                    @input="updateAdminConfig"
                  />
                </div>
                <div class="color-input">
                  <label>Secondary Color</label>
                  <input
                    v-model="adminConfig.secondaryColor"
                    type="color"
                    @input="updateAdminConfig"
                  />
                </div>
              </div>
            </div>

            <!-- Typography Settings -->
            <div class="setting-group">
              <h4>Typography</h4>
              <div class="typography-settings">
                <div class="font-input">
                  <label>Font Family</label>
                  <select v-model="adminConfig.fontFamily" @change="updateAdminConfig">
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Open Sans, sans-serif">Open Sans</option>
                    <option value="Arial, sans-serif">Arial</option>
                  </select>
                </div>
                <div class="font-input">
                  <label>Font Size</label>
                  <input
                    v-model="fontSizeValue"
                    type="range"
                    min="12"
                    max="20"
                    @input="updateFontSize"
                  />
                  <span class="font-size-display">{{ adminConfig.fontSize }}px</span>
                </div>
              </div>
            </div>

            <!-- Logo Settings -->
            <div class="setting-group">
              <h4>Branding</h4>
              <div class="logo-settings">
                <div class="logo-preview">
                  <img
                    v-if="adminConfig.logoUrl && adminConfig.logoUrl !== '/placeholder.svg'"
                    :src="adminConfig.logoUrl"
                    alt="Logo"
                    class="preview-logo"
                  />
                  <div v-else class="no-logo">No logo set</div>
                </div>
                <div class="logo-actions">
                  <button @click="triggerFileUpload" class="upload-btn">
                    Upload Logo
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                    @change="handleFileUpload"
                    style="display: none"
                  />
                  <button
                    v-if="adminConfig.logoUrl && adminConfig.logoUrl !== '/placeholder.svg'"
                    @click="removeLogo"
                    class="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="admin-actions">
              <button @click="resetToDefault" class="reset-btn">Reset to Default</button>
              <button @click="saveAdminConfig" class="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useWidgetStore } from '@/stores/widget'

// Props
interface Props {
  embedded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  embedded: false
})

// Store
const store = useWidgetStore()

// Config from store
const config = computed(() => store.config)

// Reactive state
const isOpen = ref(false)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const widgetPosition = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })

// Chat state
const messages = ref<Array<{
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}>>([])
const userInput = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()
const inputRef = ref<HTMLTextAreaElement>()

// Admin state
const showAdminModal = ref(false)
const isAdminAuthenticated = ref(false)
const adminPassword = ref('')
const passwordError = ref('')
const passwordInput = ref<HTMLInputElement>()
const fileInput = ref<HTMLInputElement>()
const adminConfig = ref({
  primaryColor: '#6366f1',
  secondaryColor: '#ec4899',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  logoUrl: '/eGainLogo.png'
})

// Computed
const widgetStyles = computed(() => ({
  '--widget-x': `${widgetPosition.value.x}px`,
  '--widget-y': `${widgetPosition.value.y}px`,
  '--primary-color': adminConfig.value.primaryColor,
  '--secondary-color': adminConfig.value.secondaryColor,
  '--font-family': adminConfig.value.fontFamily,
  '--font-size': `${adminConfig.value.fontSize}px`
}))

const fontSizeValue = computed({
  get: () => adminConfig.value.fontSize,
  set: (value: number) => {
    adminConfig.value.fontSize = value
  }
})

// Methods
const toggleOpen = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    resetPosition()
    // Add welcome message if no messages exist
    if (messages.value.length === 0) {
      addMessage('assistant', "Hi! I'm your AI guidance assistant. Please describe the problem you're trying to solve, and I'll help you find the best solution.")
    }
  } else {
    resetPosition()
  }
}

const addMessage = (type: 'user' | 'assistant', content: string) => {
  messages.value.push({
    type,
    content,
    timestamp: new Date()
  })
  scrollToBottom()
}

const sendMessage = async () => {
  const message = userInput.value.trim()
  if (!message || isTyping.value) return

  // Add user message
  addMessage('user', message)
  userInput.value = ''

  // Show typing indicator
  isTyping.value = true

  // Simulate AI response
  setTimeout(() => {
    isTyping.value = false
    const response = generateAIResponse(message)
    addMessage('assistant', response)
  }, 1500)
}

const generateAIResponse = (message: string): string => {
  // Enhanced response logic with image options
  const messageLower = message.toLowerCase()

  // Check for specific keywords to provide relevant responses with images
  if (messageLower.includes('hardware') || messageLower.includes('computer') || messageLower.includes('device')) {
    return `I see you're having hardware issues. Let me show you some common solutions:<br><br>
    <div class="image-options">
      <div class="image-option">
        <img src="/hardware-icon.svg" alt="Hardware Support" class="response-image">
        <span>Hardware Support</span>
      </div>
      <div class="image-option">
        <img src="/computer-icon.svg" alt="Computer Issues" class="response-image">
        <span>Computer Issues</span>
      </div>
      <div class="image-option">
        <img src="/device-icon.svg" alt="Device Problems" class="response-image">
        <span>Device Problems</span>
      </div>
    </div>`
  }

  if (messageLower.includes('software') || messageLower.includes('app') || messageLower.includes('program')) {
    return `Software issues can be tricky! Here are some helpful resources:<br><br>
    <div class="image-options">
      <div class="image-option">
        <img src="/software-icon.svg" alt="Software Support" class="response-image">
        <span>Software Support</span>
      </div>
      <div class="image-option">
        <img src="/app-icon.svg" alt="App Issues" class="response-image">
        <span>App Issues</span>
      </div>
      <div class="image-option">
        <img src="/program-icon.svg" alt="Program Help" class="response-image">
        <span>Program Help</span>
      </div>
    </div>`
  }

  if (messageLower.includes('network') || messageLower.includes('internet') || messageLower.includes('wifi')) {
    return `Network connectivity issues? Let me help you troubleshoot:<br><br>
    <div class="image-options">
      <div class="image-option">
        <img src="/network-icon.svg" alt="Network Issues" class="response-image">
        <span>Network Issues</span>
      </div>
      <div class="image-option">
        <img src="/wifi-icon.svg" alt="WiFi Problems" class="response-image">
        <span>WiFi Problems</span>
      </div>
      <div class="image-option">
        <img src="/internet-icon.svg" alt="Internet Connection" class="response-image">
        <span>Internet Connection</span>
      </div>
    </div>`
  }

  // Default responses
  const responses = [
    "I understand you're looking for guidance. Let me ask you a few questions to better understand your needs.",
    "That's an interesting challenge. Based on what you've described, I can help you find the right solution.",
    "Thank you for sharing that information. I'll analyze your situation and provide personalized recommendations.",
    "I see what you're trying to accomplish. Let me gather some additional details to provide the best guidance."
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (timestamp: Date): string => {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Dragging functionality
const handleMouseDown = (event: MouseEvent | TouchEvent) => {
  if (!props.embedded || !isOpen.value) return

  const target = event.target as HTMLElement
  if (target.closest('button, input, textarea, .chat-input-area')) return

  event.preventDefault()
  isDragging.value = true

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  dragOffset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleMouseMove, { passive: false })
  document.addEventListener('touchend', handleMouseUp)
}

const handleMouseMove = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  event.preventDefault()

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  const newX = clientX - dragOffset.value.x
  const newY = clientY - dragOffset.value.y

  // Constrain to viewport bounds
  const maxX = window.innerWidth - 400
  const maxY = window.innerHeight - 600

  widgetPosition.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
}

  const calculateTopRightPosition = () => {
    const margin = 15
    const widgetWidth = 400

    return {
      x: window.innerWidth - widgetWidth - margin,
      y: margin
    }
  }

const resetPosition = () => {
  if (props.embedded) {
    const position = calculateTopRightPosition()
    widgetPosition.value = position
    initialPosition.value = position
  }
}

// Admin functionality
const showAdminPanel = () => {
  showAdminModal.value = true
  isAdminAuthenticated.value = false
  adminPassword.value = ''
  passwordError.value = ''

  nextTick(() => {
    passwordInput.value?.focus()
  })
}

const closeAdminModal = () => {
  showAdminModal.value = false
  isAdminAuthenticated.value = false
  adminPassword.value = ''
  passwordError.value = ''
}

const authenticateAdmin = () => {
  if (adminPassword.value === 'admin123') {
    isAdminAuthenticated.value = true
    passwordError.value = ''
  } else {
    passwordError.value = 'Incorrect password'
    adminPassword.value = ''
  }
}

const updateAdminConfig = () => {
  // Update CSS variables
  document.documentElement.style.setProperty('--primary-color', adminConfig.value.primaryColor)
  document.documentElement.style.setProperty('--secondary-color', adminConfig.value.secondaryColor)
  document.documentElement.style.setProperty('--font-family', adminConfig.value.fontFamily)
  document.documentElement.style.setProperty('--font-size', `${adminConfig.value.fontSize}px`)
}

const updateFontSize = () => {
  updateAdminConfig()
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    processLogoFile(file)
  }
}

const processLogoFile = (file: File) => {
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be less than 2MB')
    return
  }

  const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    alert('Please upload a PNG, JPG, or SVG file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    adminConfig.value.logoUrl = e.target?.result as string
    updateAdminConfig()
  }
  reader.readAsDataURL(file)
}

const removeLogo = () => {
  adminConfig.value.logoUrl = '/placeholder.svg'
  updateAdminConfig()
}

const resetToDefault = () => {
  adminConfig.value = {
    primaryColor: '#6366f1',
    secondaryColor: '#ec4899',
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    logoUrl: '/eGainLogo.png'
  }
  updateAdminConfig()
}

const saveAdminConfig = () => {
  // In a real implementation, this would save to backend
  console.log('Admin config saved:', adminConfig.value)
  closeAdminModal()
}

// Lifecycle
onMounted(() => {
  resetPosition()
  updateAdminConfig()

  if (props.embedded) {
    window.addEventListener('resize', resetPosition)
  }
})

onUnmounted(() => {
  if (props.embedded) {
    window.removeEventListener('resize', resetPosition)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
})

// Auto-resize textarea
watch(userInput, () => {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
      inputRef.value.style.height = `${inputRef.value.scrollHeight}px`
    }
  })
})
</script>

<style scoped>
/* CSS Variables */
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --font-family: Inter, sans-serif;
  --font-size: 14px;
}

/* Floating Action Button */
.chat-widget-fab {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.chat-widget-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.4);
}

.chat-widget-fab:active {
  transform: scale(0.95);
}

.fab-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.fab-icon {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

/* Main Widget Container */
.chat-widget {
  position: fixed;
  top: var(--widget-y, 15px);
  right: var(--widget-x, auto);
  left: auto;
  z-index: 9999;
  font-family: var(--font-family);
  font-size: var(--font-size);
}

.chat-widget-embedded {
  top: var(--widget-y, 15px);
  right: var(--widget-x, auto);
  left: auto;
  transition: top 0.3s ease, left 0.3s ease;
  will-change: transform;
}

.chat-widget-container {
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.chat-widget-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
}

.chat-widget-container.dragging {
  cursor: grabbing;
  transition: none;
  transform: scale(1.02);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
}

/* Header */
.chat-widget-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: relative;
  overflow: hidden;
}

.chat-widget-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
  position: relative;
}

.header-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.header-text {
  flex: 1;
}

.chat-widget-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.chat-widget-subtitle {
  font-size: 12px;
  margin: 2px 0 0 0;
  opacity: 0.9;
  font-weight: 400;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
  position: relative;
}

.admin-button,
.minimize-button {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.admin-button:hover,
.minimize-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}

.message {
  display: flex;
  gap: 12px;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #e2e8f0;
  color: #64748b;
}

.message-content {
  flex: 1;
  max-width: 280px;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  word-wrap: break-word;
  line-height: 1.4;
}

.message.user .message-bubble {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-bottom-right-radius: 6px;
}

.message.assistant .message-bubble {
  border-bottom-left-radius: 6px;
}

.message-bubble.typing {
  background: #e2e8f0;
  padding: 16px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
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

.message-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}

/* Image Options in Messages */
.image-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.image-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.image-option:hover {
  background: rgba(255, 255, 255, 0.95);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.response-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
}

.image-option span {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-align: center;
  line-height: 1.2;
}

/* Input Area */
.chat-input-area {
  padding: 20px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.input-container {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  padding: 12px 16px;
  font-family: inherit;
  font-size: inherit;
  resize: none;
  outline: none;
  transition: all 0.2s ease;
  max-height: 120px;
  min-height: 48px;
  line-height: 1.4;
}

.chat-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.chat-input::placeholder {
  color: #94a3b8;
}

.send-button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(.disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.send-button.disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

/* Admin Modal */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.admin-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Password Screen */
.admin-password-screen {
  padding: 40px;
  text-align: center;
}

.admin-modal-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #1e293b;
}

.admin-modal-subtitle {
  color: #64748b;
  margin: 0 0 32px 0;
  font-size: 14px;
}

.password-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.password-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.password-input:focus {
  border-color: var(--primary-color);
}

.password-submit-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.password-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.password-error {
  color: #ef4444;
  font-size: 14px;
  margin: 0;
}

.password-hint {
  color: #6366f1;
  font-size: 12px;
  margin: 8px 0 0 0;
  opacity: 0.8;
  font-style: italic;
}

/* Admin Settings Screen */
.admin-settings-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.admin-header {
  padding: 24px 24px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.close-admin-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  color: #64748b;
  transition: all 0.2s ease;
}

.close-admin-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.setting-group {
  margin-bottom: 32px;
}

.setting-group h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #1e293b;
}

.color-settings,
.typography-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.color-input,
.font-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-input label,
.font-input label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-input input[type="color"] {
  width: 100%;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
}

.font-input select {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.font-input select:focus {
  border-color: var(--primary-color);
}

.font-input input[type="range"] {
  width: 100%;
  margin: 8px 0;
}

.font-size-display {
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

.logo-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo-preview {
  width: 100%;
  height: 80px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

.preview-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-logo {
  color: #94a3b8;
  font-size: 14px;
}

.logo-actions {
  display: flex;
  gap: 12px;
}

.upload-btn,
.remove-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.upload-btn {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.upload-btn:hover {
  background: var(--primary-color);
  color: white;
}

.remove-btn {
  border-color: #ef4444;
  color: #ef4444;
}

.remove-btn:hover {
  background: #ef4444;
  color: white;
}

.admin-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.reset-btn,
.save-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn {
  background: #f1f5f9;
  color: #64748b;
}

.reset-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.save-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-widget-container {
    width: calc(100vw - 30px);
    height: 80vh;
    max-width: 400px;
  }

  .chat-widget-embedded .chat-widget-container {
    top: 15px;
    right: 15px;
    left: auto;
    width: calc(100vw - 30px);
    max-width: 350px;
    height: 80vh;
    border-radius: 12px;
  }

  .color-settings,
  .typography-settings {
    grid-template-columns: 1fr;
  }

  .admin-modal {
    width: 95%;
    margin: 20px;
  }

  .admin-content {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .chat-widget-header {
    padding: 16px;
  }

  .chat-widget-title {
    font-size: 16px;
  }

  .chat-widget-subtitle {
    font-size: 11px;
  }

  .chat-messages {
    padding: 16px;
  }

  .chat-input-area {
    padding: 16px;
  }

  .message-content {
    max-width: 240px;
  }

  .image-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .image-option {
    padding: 8px;
  }

  .response-image {
    width: 36px;
    height: 36px;
  }

  .image-option span {
    font-size: 11px;
  }
}

/* Animation for widget appearance */
.chat-widget-open {
  animation: widgetSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes widgetSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Pulse animation for FAB */
.chat-widget-fab {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5), 0 0 0 8px rgba(99, 102, 241, 0.1);
  }
}
</style>
