<template>
  <!-- Floating Action Button (when embedded and closed) - Positioned independently -->
  <div v-if="embedded && !isOpen" class="widget-fab" @click="toggleOpen">
    <img
      v-if="config.logoUrl && config.logoUrl !== '/placeholder.svg'"
      :src="config.logoUrl"
      alt="Logo"
      class="fab-logo"
    />
    <div v-else class="fab-icon">?</div>
  </div>

  <!-- Main Widget Container -->
  <div
    v-if="!embedded || isOpen"
    class="guidance-widget"
    :class="{ 'widget-open': isOpen, 'widget-embedded': embedded }"
    :style="widgetStyles"
  >
    <div
      class="widget-container"
      :class="{ 'dragging': isDragging }"
      @mousedown="handleMouseDown"
      @touchstart="handleMouseDown"
    >
      <!-- Header -->
      <div
        class="widget-header"
        :class="{ 'draggable': embedded && isOpen }"
      >
        <div class="header-content">
          <h2 class="widget-title">Interactive Guidance</h2>
          <p class="widget-subtitle">Let us help you find the perfect solution.</p>
        </div>
        <div class="header-actions">
          <!-- Admin Settings Button -->
          <button
            class="admin-button"
            @click="showAdminPanel"
            aria-label="Admin settings"
            title="Admin settings"
          >
            ⚙️
          </button>
          <button
            v-if="embedded"
            class="close-button"
            @click="toggleOpen"
            aria-label="Close widget"
          >
            ×
          </button>
          <img
            v-if="config.logoUrl && config.logoUrl !== '/placeholder.svg'"
            :src="config.logoUrl"
            alt="Logo"
            class="widget-logo"
            @error="handleLogoError"
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
              type="password"
              class="password-input"
              placeholder="Enter password"
              @keydown.enter="authenticateAdmin"
              ref="passwordInput"
            />
            <button @click="authenticateAdmin" class="password-submit-btn">
              Access
            </button>
          </div>

          <div v-if="passwordError" class="password-error">
            {{ passwordError }}
          </div>
        </div>

        <!-- Admin Settings Screen -->
        <div v-else class="admin-settings-screen">
          <div class="admin-modal-header">
            <h3 class="admin-modal-title">Widget Configuration</h3>
            <button @click="closeAdminModal" class="admin-close-btn">×</button>
          </div>

          <div class="admin-settings-content">
            <!-- Colors Section -->
            <div class="admin-section">
              <h4 class="admin-section-title">Colors</h4>

              <div class="admin-setting-group">
                <label class="admin-label">
                  <span>Primary Color</span>
                  <div class="color-input-group">
                    <input
                      type="color"
                      v-model="adminConfig.primaryColor"
                      class="color-picker"
                      @change="updateAdminConfig"
                    />
                    <input
                      type="text"
                      v-model="adminConfig.primaryColor"
                      class="color-text"
                      @input="updateAdminConfig"
                      placeholder="#9333ea"
                    />
                  </div>
                </label>
              </div>

              <div class="admin-setting-group">
                <label class="admin-label">
                  <span>Secondary Color</span>
                  <div class="color-input-group">
                    <input
                      type="color"
                      v-model="adminConfig.secondaryColor"
                      class="color-picker"
                      @change="updateAdminConfig"
                    />
                    <input
                      type="text"
                      v-model="adminConfig.secondaryColor"
                      class="color-text"
                      @input="updateAdminConfig"
                      placeholder="#f1f5f9"
                    />
                  </div>
                </label>
              </div>
            </div>

            <!-- Typography Section -->
            <div class="admin-section">
              <h4 class="admin-section-title">Typography</h4>

              <div class="admin-setting-group">
                <label class="admin-label">
                  <span>Font Family</span>
                  <select v-model="adminConfig.fontFamily" @change="updateAdminConfig" class="font-select">
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Open Sans, sans-serif">Open Sans</option>
                    <option value="Lato, sans-serif">Lato</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                  </select>
                </label>
              </div>

              <div class="admin-setting-group">
                <label class="admin-label">
                  <span>Font Size</span>
                  <div class="font-size-group">
                    <input
                      type="range"
                      v-model="fontSizeValue"
                      min="12"
                      max="24"
                      step="1"
                      class="font-size-slider"
                      @input="updateFontSize"
                    />
                    <span class="font-size-display">{{ adminConfig.fontSize }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Logo Section -->
            <div class="admin-section">
              <h4 class="admin-section-title">Logo</h4>

              <div class="logo-upload-group">
                <div class="current-logo-preview">
                  <span class="logo-label">Current Logo</span>
                  <div class="logo-preview">
                    <img
                      v-if="adminConfig.logoUrl && adminConfig.logoUrl !== '/placeholder.svg'"
                      :src="adminConfig.logoUrl"
                      alt="Current Logo"
                      class="logo-image"
                      @error="handleLogoError"
                    />
                    <div v-else class="logo-placeholder">No logo</div>
                  </div>
                </div>

                <div class="logo-upload">
                  <label class="upload-label">
                    <span>Upload New Logo</span>
                    <div class="upload-area" @click="triggerFileUpload" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        @change="handleFileUpload"
                        class="file-input"
                      />
                      <div class="upload-content">
                        <span class="upload-icon">📁</span>
                        <span class="upload-text">Click to upload or drag & drop</span>
                        <span class="upload-hint">PNG, JPG, SVG (max 2MB)</span>
                      </div>
                    </div>
                  </label>
                </div>

                <div class="logo-actions">
                  <button
                    v-if="adminConfig.logoUrl && adminConfig.logoUrl !== '/placeholder.svg'"
                    @click="removeLogo"
                    class="remove-logo-btn"
                  >
                    Remove Logo
                  </button>
                  <button @click="resetToDefault" class="reset-btn">
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="admin-actions">
              <button @click="saveAdminConfig" class="save-btn">
                Save Changes
              </button>
              <button @click="closeAdminModal" class="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

// Draggable state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const widgetPosition = ref({ x: 0, y: 15 }) // Will be calculated dynamically
const initialPosition = { x: 0, y: 15 } // Store initial position

// Admin state
const showAdminModal = ref(false)
const isAdminAuthenticated = ref(false)
const adminPassword = ref('')
const passwordError = ref('')
const passwordInput = ref<HTMLInputElement>()
const fileInput = ref<HTMLInputElement>()

// Admin config (temporary until saved)
const adminConfig = ref({
  primaryColor: '#9333ea',
  secondaryColor: '#f1f5f9',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  logoUrl: '/eGainLogo.png'
})

// Computed properties
const fontSizeValue = computed({
  get: () => parseInt(adminConfig.value.fontSize) || 16,
  set: (value: number) => {
    adminConfig.value.fontSize = `${value}px`
  }
})

// Apply custom config if provided
onMounted(() => {
  if (props.config) {
    store.updateConfig(props.config)
  }

  // Set initial position to top-right corner
  resetPosition()

  // Update position on window resize
  window.addEventListener('resize', resetPosition)

  // Debug logging
  console.log('Widget mounted:', {
    embedded: props.embedded,
    isOpen: isOpen.value,
    position: widgetPosition.value,
    config: config.value
  })

  // Log FAB position for debugging
  if (props.embedded && !isOpen.value) {
    console.log('FAB should be positioned at: top: 15px, right: 15px')
  }
})

// Cleanup event listeners on unmount
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
  window.removeEventListener('resize', resetPosition)
})

// Computed properties
const isOpen = computed(() => store.isOpen)
const currentStep = computed(() => store.currentStep)
const config = computed(() => store.config)

const widgetStyles = computed(() => ({
  '--primary-color': config.value.primaryColor,
  '--secondary-color': config.value.secondaryColor,
  '--font-family': config.value.fontFamily,
  '--font-size': config.value.fontSize,
  '--widget-x': `${widgetPosition.value.x}px`,
  '--widget-y': `${widgetPosition.value.y}px`
}))

// Methods
const toggleOpen = () => {
  store.toggleOpen()

  if (store.isOpen) {
    // When opening, ensure widget starts in top-right position
    resetPosition()
  } else {
    // Reset position when closing widget
    resetPosition() // Always return to top-right when closed
  }
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
    resetPosition() // Always reset to top-right position
  }
}

// Draggable methods
const handleMouseDown = (event: MouseEvent | TouchEvent) => {
  if (!props.embedded || !isOpen.value) return

  // Prevent dragging if clicking on interactive elements
  const target = event.target as HTMLElement
  if (target.closest('button') || target.closest('input') || target.closest('textarea') || target.closest('a')) {
    return
  }

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
  event.preventDefault()
}

const handleMouseMove = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  const widgetElement = document.querySelector('.widget-embedded') as HTMLElement
  if (!widgetElement) return

  const widgetRect = widgetElement.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

  let newX = clientX - dragOffset.value.x
  let newY = clientY - dragOffset.value.y

  // Ensure widget stays on the right side of the screen
  const minX = viewportWidth / 2 // Force widget to stay on right half
  const maxX = viewportWidth - widgetRect.width - 15
  const minY = 15 // Minimum distance from top
  const maxY = viewportHeight - widgetRect.height - 15

  newX = Math.max(minX, Math.min(newX, maxX))
  newY = Math.max(minY, Math.min(newY, maxY))

  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    widgetPosition.value = { x: newX, y: newY }
  })
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleMouseMove)
  document.removeEventListener('touchend', handleMouseUp)
}

const calculateTopRightPosition = () => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Responsive widget width based on screen size
  let widgetWidth = 500
  if (viewportWidth < 768) {
    widgetWidth = Math.min(350, viewportWidth - 40) // Smaller on mobile, max 350px
  } else if (viewportWidth < 1024) {
    widgetWidth = 450 // Slightly smaller on tablets
  }

  const margin = 15
  const widgetHeight = 700 // Approximate widget height

  // Position widget in the exact top-right corner
  const x = viewportWidth - widgetWidth - margin
  const y = margin // Always at the top

  return {
    x: Math.max(margin, x), // Ensure it doesn't go off-screen
    y: Math.max(margin, Math.min(y, viewportHeight - widgetHeight - margin)) // Ensure it doesn't go off-screen
  }
}

const calculateFabPosition = () => {
  const viewportWidth = window.innerWidth
  const fabSize = 56 // FAB width/height
  const margin = 15

  // FAB should always be in the top-right corner
  return {
    x: viewportWidth - fabSize - margin,
    y: margin
  }
}

const resetPosition = () => {
  const topRightPos = calculateTopRightPosition()
  widgetPosition.value = topRightPos
  initialPosition.x = topRightPos.x
  initialPosition.y = topRightPos.y

  // Debug logging for position reset
  console.log('Widget position reset to top-right:', topRightPos)
}

const handleLogoError = (event: Event) => {
  console.warn('Logo failed to load:', config.value.logoUrl)
  // Hide the logo if it fails to load
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

// Admin methods
const showAdminPanel = () => {
  showAdminModal.value = true
  isAdminAuthenticated.value = false
  adminPassword.value = ''
  passwordError.value = ''

  // Initialize admin config with current values
  adminConfig.value = {
    primaryColor: config.value.primaryColor,
    secondaryColor: config.value.secondaryColor,
    fontFamily: config.value.fontFamily,
    fontSize: config.value.fontSize,
    logoUrl: config.value.logoUrl || '/eGainLogo.png'
  }

  // Focus password input after modal opens
  setTimeout(() => {
    passwordInput.value?.focus()
  }, 100)
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
    passwordError.value = 'Incorrect password. Please try again.'
    adminPassword.value = ''
    passwordInput.value?.focus()
  }
}

const updateAdminConfig = () => {
  // This method is called when admin config changes
  // Changes are applied immediately for preview
  store.updateConfig(adminConfig.value)
}

const updateFontSize = () => {
  updateAdminConfig()
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processLogoFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      processLogoFile(file)
    }
  }
}

const processLogoFile = (file: File) => {
  // Validate file size (2MB limit)
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be less than 2MB')
    return
  }

  // Validate file type
  if (!file.type.match(/image\/(png|jpeg|svg\+xml)/)) {
    alert('Please upload a PNG, JPG, or SVG file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    adminConfig.value.logoUrl = result
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
    primaryColor: '#9333ea',
    secondaryColor: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    logoUrl: '/eGainLogo.png'
  }
  updateAdminConfig()
}

const saveAdminConfig = () => {
  // Save the admin config to the store
  store.updateConfig(adminConfig.value)
  closeAdminModal()
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
  top: var(--widget-y, 15px);
  left: var(--widget-x, auto);
  right: auto;
  z-index: 1001;
  transition: top 0.3s ease, left 0.3s ease;
  will-change: transform;
}

/* Fallback positioning if CSS variables aren't set */
.widget-embedded:not([style*="--widget-x"]) {
  top: 15px;
  right: 15px;
  left: auto;
}

.widget-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: white;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 20px;
  border: 2px solid var(--primary-color);
  position: fixed;
  top: 15px;
  right: 15px;
  left: auto;
  z-index: 10000;
}



.widget-fab:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.fab-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 2px;
}

.widget-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.widget-embedded .widget-container {
  width: 500px;
  height: 700px;
}

.widget-header {
  background: var(--primary-color);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.widget-header.draggable {
  cursor: grab;
  user-select: none;
  position: relative;
}

.widget-header.draggable:active {
  cursor: grabbing;
}

.widget-header.draggable::after {
  content: '';
  position: absolute;
  top: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(255,255,255,0.6)'%3E%3Cpath d='M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.widget-header.draggable:hover::after {
  opacity: 1;
}

/* Enhanced drag feedback */
.widget-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.widget-container.dragging {
  transform: scale(1.02) translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Smooth transitions for all interactive states */
.widget-container {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-container.dragging {
  transition: none;
}

.widget-container {
  animation: slideIn 0.3s ease-out;
}

.widget-container {
  animation: slideIn 0.3s ease-out;
  cursor: grab;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
  gap: 12px;
  flex-shrink: 0;
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
  width: 32px;
  height: 32px;
  object-fit: contain;
  background: white;
  border-radius: 4px;
  padding: 3px;
  max-width: 100%;
  max-height: 100%;
  display: block;
  flex-shrink: 0;
  box-sizing: border-box;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
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
    top: 15px;
    right: 15px;
    left: auto;
    width: calc(100vw - 30px);
    max-width: 350px;
    height: 80vh;
    border-radius: 12px;
    max-width: none;
  }

  .widget-fab {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }

  .fab-logo {
    width: 32px;
    height: 32px;
  }

  .widget-logo {
    width: 28px;
    height: 28px;
    padding: 2px;
  }

  /* Enhanced touch feedback for mobile */
  .widget-container {
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
  }

  .widget-container.dragging {
    transform: scale(1.01) translateY(-2px);
  }
}

/* Tablet optimizations */
@media (min-width: 769px) and (max-width: 1024px) {
  .widget-container.dragging {
    transform: scale(1.015) translateY(-3px);
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
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Admin Panel Styles */
.admin-button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.admin-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.admin-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.admin-password-screen {
  padding: 32px;
  text-align: center;
}

.admin-modal-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.admin-modal-subtitle {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #6b7280;
}

.password-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.password-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.password-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.password-submit-btn {
  padding: 12px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.password-submit-btn:hover {
  background: #7c3aed;
}

.password-error {
  color: #dc2626;
  font-size: 14px;
  margin-top: 8px;
}

.admin-settings-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.admin-modal-header {
  background: #1f2937;
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-close-btn {
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

.admin-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.admin-settings-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.admin-section {
  margin-bottom: 24px;
}

.admin-section:last-child {
  margin-bottom: 0;
}

.admin-section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e1e5e9;
  padding-bottom: 8px;
}

.admin-setting-group {
  margin-bottom: 16px;
}

.admin-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.color-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-picker {
  width: 40px;
  height: 32px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.color-text {
  width: 80px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  font-family: monospace;
}

.font-select {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  min-width: 120px;
}

.font-size-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.font-size-slider {
  width: 80px;
}

.font-size-display {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  min-width: 30px;
}

.logo-upload-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.current-logo-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logo-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.logo-preview {
  width: 60px;
  height: 60px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.logo-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  font-size: 12px;
  color: #9ca3af;
}

.upload-label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(147, 51, 234, 0.02);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upload-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 14px;
  color: #374151;
}

.upload-hint {
  font-size: 12px;
  color: #9ca3af;
}

.logo-actions {
  display: flex;
  gap: 8px;
}

.remove-logo-btn,
.reset-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-logo-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.reset-btn:hover {
  background: #f3f4f6;
}

.admin-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.save-btn:hover {
  background: #7c3aed;
}

.cancel-btn {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #f3f4f6;
}

/* Responsive admin modal */
@media (max-width: 768px) {
  .admin-modal {
    width: 95%;
    max-height: 90vh;
  }

  .admin-settings-content {
    padding: 16px;
  }

  .admin-label {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .admin-actions {
    flex-direction: column;
  }
}
</style>
