<template>
  <!-- Floating Action Button (when embedded and closed) - Positioned independently -->
  <div v-if="embedded && !isOpen" class="widget-fab" @click="toggleOpen">
    <img
      v-if="widgetConfig.logoUrl && widgetConfig.logoUrl !== '/placeholder.svg'"
      :src="widgetConfig.logoUrl"
      alt="Logo"
      class="fab-logo"
      @error="handleLogoError"
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
            v-if="widgetConfig.logoUrl && widgetConfig.logoUrl !== '/placeholder.svg'"
            :src="widgetConfig.logoUrl"
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
          <div class="password-header">
            <div class="password-icon">🔐</div>
            <h3 class="admin-modal-title">Admin Access</h3>
            <p class="admin-modal-subtitle">Enter password to access Widget Studio</p>
          </div>

          <div class="password-hint">
            <span class="hint-icon">💡</span>
            <span class="hint-text">Password: <strong>admin123</strong></span>
          </div>

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
              <span class="btn-icon">🚀</span>
              Access Studio
            </button>
          </div>

          <div v-if="passwordError" class="password-error">
            <span class="error-icon">⚠️</span>
            {{ passwordError }}
          </div>
        </div>

        <!-- Admin Settings Screen -->
        <div v-else class="admin-settings-screen">
          <!-- Studio Header -->
          <div class="studio-header">
            <div class="header-content">
              <div class="header-left">
                <div class="studio-icon">🎨</div>
                <div class="studio-title">
                  <h2>Widget Studio</h2>
                  <p>Design your perfect widget</p>
                </div>
              </div>
              <div class="header-right">
                <div class="device-controls">
                  <button class="device-btn active" @click="setDeviceView('desktop')">
                    <span class="device-icon">🖥️</span>
                    Desktop
                  </button>
                  <button class="device-btn" @click="setDeviceView('tablet')">
                    <span class="device-icon">📱</span>
                    Tablet
                  </button>
                  <button class="device-btn" @click="setDeviceView('mobile')">
                    <span class="device-icon">📱</span>
                    Mobile
                  </button>
                </div>
                <button @click="closeAdminModal" class="close-studio-btn">×</button>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="tab-navigation">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'design' }"
              @click="setActiveTab('design')"
            >
              <span class="tab-icon">🎨</span>
              Design
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'typography' }"
              @click="setActiveTab('typography')"
            >
              <span class="tab-icon">T</span>
              Typography
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'branding' }"
              @click="setActiveTab('branding')"
            >
              <span class="tab-icon">🖼️</span>
              Branding
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'export' }"
              @click="setActiveTab('export')"
            >
              <span class="tab-icon">&lt;/&gt;</span>
              Export
            </button>
          </div>

          <!-- Main Content Area -->
          <div class="studio-content">
            <!-- Left Panel - Settings -->
            <div class="settings-panel">
              <!-- Design Tab -->
              <div v-if="activeTab === 'design'" class="tab-content">
                <div class="section-header">
                  <div class="section-icon">🎨</div>
                  <div>
                    <h3>Color Palette</h3>
                    <p>Define your brand colors</p>
                  </div>
                </div>

                <!-- Color Selection -->
                <div class="color-section">
                  <div class="color-cards-container">
                    <!-- Primary Color Card -->
                    <div class="color-card primary-card">
                      <div class="color-card-header">
                        <div class="color-info">
                          <span class="color-label">Primary Color</span>
                          <span class="color-hex">{{ adminConfig.primaryColor }}</span>
                        </div>
                        <div
                          class="color-preview-large"
                          :style="{ backgroundColor: adminConfig.primaryColor }"
                          @click="openColorPicker('primary')"
                        ></div>
                      </div>
                      <div class="color-card-content">
                        <div class="color-input-group">
                          <input
                            type="color"
                            ref="primaryColorPicker"
                            v-model="adminConfig.primaryColor"
                            @change="updateAdminConfig"
                            class="hidden-color-picker"
                          />
                          <input
                            type="text"
                            v-model="adminConfig.primaryColor"
                            @input="updateAdminConfig"
                            class="color-hex-input"
                            placeholder="#8b5cf6"
                          />
                        </div>
                        <div class="color-variants">
                          <div
                            v-for="variant in getColorVariants(adminConfig.primaryColor)"
                            :key="variant"
                            class="color-variant"
                            :style="{ backgroundColor: variant }"
                            @click="adminConfig.primaryColor = variant; updateAdminConfig()"
                            :title="variant"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Secondary Color Card -->
                    <div class="color-card secondary-card">
                      <div class="color-card-header">
                        <div class="color-info">
                          <span class="color-label">Secondary Color</span>
                          <span class="color-hex">{{ adminConfig.secondaryColor }}</span>
                        </div>
                        <div
                          class="color-preview-large"
                          :style="{ backgroundColor: adminConfig.secondaryColor }"
                          @click="openColorPicker('secondary')"
                        ></div>
                      </div>
                      <div class="color-card-content">
                        <div class="color-input-group">
                          <input
                            type="color"
                            ref="secondaryColorPicker"
                            v-model="adminConfig.secondaryColor"
                            @change="updateAdminConfig"
                            class="hidden-color-picker"
                          />
                          <input
                            type="text"
                            v-model="adminConfig.secondaryColor"
                            @input="updateAdminConfig"
                            class="color-hex-input"
                            placeholder="#d946ef"
                          />
                        </div>
                        <div class="color-variants">
                          <div
                            v-for="variant in getColorVariants(adminConfig.secondaryColor)"
                            :key="variant"
                            class="color-variant"
                            :style="{ backgroundColor: variant }"
                            @click="adminConfig.secondaryColor = variant; updateAdminConfig()"
                            :title="variant"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Quick Presets -->
                <div class="presets-section">
                  <div class="presets-header">
                    <h4>Quick Presets</h4>
                    <p>Choose from curated color combinations</p>
                    <button @click="generateRandomColors" class="random-btn">
                      <span class="random-icon">✨</span>
                      Random
                    </button>
                  </div>
                  <div class="presets-grid">
                    <div
                      v-for="preset in colorPresets"
                      :key="preset.name"
                      class="preset-card"
                      :class="{ active: isPresetActive(preset) }"
                      @click="applyColorPreset(preset)"
                    >
                      <div class="preset-preview">
                        <div class="preset-gradient" :style="{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }"></div>
                        <div class="preset-colors">
                          <div class="preset-color" :style="{ backgroundColor: preset.primary }"></div>
                          <div class="preset-color" :style="{ backgroundColor: preset.secondary }"></div>
                        </div>
                      </div>
                      <div class="preset-info">
                        <span class="preset-name">{{ preset.name }}</span>
                        <span class="preset-description">{{ getPresetDescription(preset.name) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Typography Tab -->
              <div v-if="activeTab === 'typography'" class="tab-content">
                <div class="section-header">
                  <div class="section-icon">T</div>
                  <div>
                    <h3>Typography Settings</h3>
                    <p>Choose fonts and sizes</p>
                  </div>
                </div>

                <!-- Font Family -->
                <div class="typography-section">
                  <div class="typography-header">
                    <h4>Font Family</h4>
                    <p>Choose your preferred typeface</p>
                  </div>
                  <div class="font-grid">
                    <div
                      v-for="font in fontOptions"
                      :key="font.value"
                      class="font-card"
                      :class="{ active: adminConfig.fontFamily === font.value }"
                      @click="selectFont(font.value)"
                    >
                      <div class="font-preview">
                        <span class="font-sample" :style="{ fontFamily: font.value }">Aa</span>
                      </div>
                      <div class="font-info">
                        <span class="font-name" :style="{ fontFamily: font.value }">{{ font.name }}</span>
                        <span class="font-description">{{ font.description }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Font Size -->
                <div class="font-size-section">
                  <div class="typography-header">
                    <h4>Font Size</h4>
                    <p>Select the perfect text size</p>
                  </div>
                  <div class="size-options">
                    <div
                      v-for="size in fontSizes"
                      :key="size.value"
                      class="size-card"
                      :class="{ active: adminConfig.fontSize === size.value }"
                      @click="selectFontSize(size.value)"
                    >
                      <div class="size-preview">
                        <span class="size-sample" :style="{ fontSize: size.value }">T</span>
                      </div>
                      <div class="size-info">
                        <span class="size-name">{{ size.name }}</span>
                        <span class="size-value">{{ size.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Branding Tab -->
              <div v-if="activeTab === 'branding'" class="tab-content">
                <div class="section-header">
                  <div class="section-icon">🖼️</div>
                  <div>
                    <h3>Brand Identity</h3>
                    <p>Customize your brand appearance</p>
                  </div>
                </div>

                <!-- Company Name -->
                <div class="branding-section">
                  <label>Company Name</label>
                  <input
                    type="text"
                    v-model="adminConfig.logoUrl"
                    @input="updateAdminConfig"
                    class="company-input"
                    placeholder="eGain"
                  />
                </div>

                <!-- Logo Upload -->
                <div class="logo-section">
                  <label>Logo</label>
                  <div class="logo-upload-area">
                    <div class="logo-preview-large">
                      <img
                        v-if="adminConfig.logoUrl && adminConfig.logoUrl !== '/placeholder.svg'"
                        :src="adminConfig.logoUrl"
                        alt="Current Logo"
                        class="logo-image-large"
                        @error="handleLogoError"
                      />
                      <div v-else class="logo-placeholder-large">
                        <span class="placeholder-icon-large">🖼️</span>
                      </div>
                    </div>
                    <div class="upload-zone">
                      <div
                        class="upload-area-modern"
                        :class="{ 'processing': isProcessingLogo }"
                        @click="!isProcessingLogo && triggerFileUpload()"
                        @drop="!isProcessingLogo && handleFileDrop($event)"
                        @dragover.prevent
                        @dragenter.prevent
                      >
                        <input
                          ref="fileInput"
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml"
                          @change="handleFileUpload"
                          class="file-input"
                        />
                        <div class="upload-content-modern">
                          <div v-if="isProcessingLogo" class="upload-loading">
                            <div class="loading-spinner"></div>
                            <span>Processing logo...</span>
                          </div>
                          <div v-else>
                            <span class="upload-icon-modern">📁</span>
                            <span class="upload-text-modern">Upload new logo</span>
                            <span class="upload-hint-modern">PNG, JPG, SVG up to 5MB</span>
                            <button class="choose-file-btn">Choose File</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Logo Guidelines -->
                  <div class="logo-guidelines">
                    <div class="guidelines-header">
                      <span class="guidelines-icon">👁️</span>
                      <span class="guidelines-title">Logo Guidelines</span>
                    </div>
                    <ul class="guidelines-list">
                      <li>Will be resized to 44×44px automatically</li>
                      <li>Appears in top-right corner of widget</li>
                      <li>Square format works best</li>
                      <li>Use transparent background for best results</li>
                    </ul>
                  </div>

                  <!-- Logo Preview & Upload Actions -->
                  <div v-if="selectedFile && !isProcessingLogo" class="logo-preview-section">
                    <div class="preview-header">
                      <h4>Logo Preview</h4>
                      <p>Review your logo before uploading</p>
                    </div>

                    <div class="logo-preview-card">
                      <div class="preview-logo">
                        <img
                          :src="previewLogoUrl"
                          alt="Logo Preview"
                          class="preview-image"
                          @error="handlePreviewError"
                        />
                      </div>
                      <div class="preview-info">
                        <span class="file-name">{{ selectedFile.name }}</span>
                        <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                      </div>
                    </div>

                    <div class="upload-actions">
                      <button @click="confirmLogoUpload" class="upload-confirm-btn">
                        <span class="upload-icon">✓</span>
                        Confirm Upload
                      </button>
                      <button @click="cancelLogoUpload" class="upload-cancel-btn">
                        <span class="cancel-icon">✕</span>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Export Tab -->
              <div v-if="activeTab === 'export'" class="tab-content">
                <div class="section-header">
                  <div class="section-icon">&lt;/&gt;</div>
                  <div>
                    <h3>Export Widget</h3>
                    <p>Get your widget code</p>
                  </div>
                </div>

                <div class="export-section">
                  <div class="export-card">
                    <h4>Embed Code</h4>
                    <p>Copy this code to embed the widget on your website</p>
                    <div class="code-block">
                      <pre><code>{{ embedCode }}</code></pre>
                      <button @click="copyEmbedCode" class="copy-btn">
                        <span class="copy-icon">📋</span>
                        Copy Code
                      </button>
                    </div>
                  </div>

                  <div class="export-card">
                    <h4>Configuration</h4>
                    <p>Download your widget configuration</p>
                    <button @click="exportConfig" class="export-btn">
                      <span class="export-icon">📥</span>
                      Export Config
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panel - Live Preview -->
            <div class="preview-panel">
              <div class="preview-header">
                <h3>Live Preview</h3>
                <span class="preview-subtitle">See changes in real-time</span>
              </div>
              <div class="preview-container" :class="deviceView">
                <div class="widget-preview">
                  <!-- Mini widget preview here -->
                  <div class="preview-widget" :style="previewStyles">
                    <div class="preview-header" :style="{ background: 'linear-gradient(135deg, ' + adminConfig.primaryColor + ', ' + adminConfig.secondaryColor + ')' }">
                      <span class="preview-title">Widget Preview</span>
                    </div>
                    <div class="preview-content">
                      <p>This is how your widget will look with the current settings.</p>
                    </div>
                  </div>
                </div>
              </div>
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
const widgetPosition = ref({ x: 0, y: 50 }) // Will be calculated dynamically
const initialPosition = { x: 0, y: 50 } // Store initial position

// Admin state
const showAdminModal = ref(false)
const isAdminAuthenticated = ref(false)
const adminPassword = ref('')
const passwordError = ref('')
const passwordInput = ref<HTMLInputElement>()
const fileInput = ref<HTMLInputElement>()
const isProcessingLogo = ref(false)
const selectedFile = ref<File | null>(null)
const previewLogoUrl = ref<string>('')
const primaryColorPicker = ref<HTMLInputElement>()
const secondaryColorPicker = ref<HTMLInputElement>()

// Studio state
const activeTab = ref('design')
const deviceView = ref('desktop')

// Color presets
const colorPresets = ref([
  { name: 'Purple Magic', primary: '#8b5cf6', secondary: '#d946ef' },
  { name: 'Ocean Blue', primary: '#3b82f6', secondary: '#06b6d4' },
  { name: 'Emerald Green', primary: '#10b981', secondary: '#34d399' },
  { name: 'Sunset Orange', primary: '#f59e0b', secondary: '#ef4444' },
  { name: 'Rose Pink', primary: '#ec4899', secondary: '#f97316' },
  { name: 'Midnight Dark', primary: '#1f2937', secondary: '#374151' }
])

// Font options
const fontOptions = ref([
  { name: 'Inter', value: 'Inter, sans-serif', description: 'Modern & Clean' },
  { name: 'System UI', value: 'system-ui, sans-serif', description: 'Native Feel' },
  { name: 'Georgia', value: 'Georgia, serif', description: 'Classic Serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif', description: 'Friendly & Round' },
  { name: 'Roboto', value: 'Roboto, sans-serif', description: 'Google Style' },
  { name: 'Monospace', value: 'Monaco, monospace', description: 'Code Style' }
])

// Font sizes
const fontSizes = ref([
  { name: 'Small', value: '14px' },
  { name: 'Medium', value: '16px' },
  { name: 'Large', value: '18px' }
])

// Admin config (temporary until saved)
const adminConfig = ref({
  primaryColor: '#8b5cf6',
  secondaryColor: '#d946ef',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  logoUrl: '/eGainLogo.png',
  maxQuestionsBeforeSolution: 3
})

// Computed properties
const isOpen = computed(() => store.isOpen)
const currentStep = computed(() => store.currentStep)
const widgetConfig = computed(() => store.config)

// Font size computed property removed as it's not being used

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
    config: widgetConfig.value
  })

  // Log FAB position for debugging
  if (props.embedded && !isOpen.value) {
    console.log('FAB should be positioned at: top: 15px, right: 15px')
    console.log('FAB should be visible:', props.embedded && !isOpen.value)
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

const widgetStyles = computed(() => {
  const styles = {
    '--primary-color': widgetConfig.value.primaryColor,
    '--secondary-color': widgetConfig.value.secondaryColor,
    '--font-family': widgetConfig.value.fontFamily,
    '--font-size': widgetConfig.value.fontSize,
    '--widget-x': `${widgetPosition.value.x}px`,
    '--widget-y': `${widgetPosition.value.y}px`
  }
  console.log('Widget styles computed:', styles)
  return styles
})

// Methods
const toggleOpen = () => {
  store.toggleOpen()

  if (store.isOpen) {
    // When opening, ensure widget starts in top-right position
    resetPosition()
    console.log('Widget opened, positioned at top-right')
  } else {
    // Reset position when closing widget
    resetPosition() // Always return to top-right when closed
    console.log('Widget closed, reset to top-right')
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

  // Allow dragging anywhere within viewport bounds
  const minX = 15 // Minimum distance from left edge
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



const resetPosition = () => {
  const topRightPos = calculateTopRightPosition()
  widgetPosition.value = topRightPos
  initialPosition.x = topRightPos.x
  initialPosition.y = topRightPos.y

  // Debug logging for position reset
  console.log('Widget position reset to top-right:', topRightPos)
}

const handleLogoError = (event: Event) => {
  console.warn('Logo failed to load:', widgetConfig.value.logoUrl)
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
    primaryColor: widgetConfig.value.primaryColor,
    secondaryColor: widgetConfig.value.secondaryColor,
    fontFamily: widgetConfig.value.fontFamily,
    fontSize: widgetConfig.value.fontSize,
    logoUrl: widgetConfig.value.logoUrl || '/eGainLogo.png',
    maxQuestionsBeforeSolution: widgetConfig.value.maxQuestionsBeforeSolution
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
  store.updateConfig({
    primaryColor: adminConfig.value.primaryColor,
    secondaryColor: adminConfig.value.secondaryColor,
    fontFamily: adminConfig.value.fontFamily,
    fontSize: adminConfig.value.fontSize,
    logoUrl: adminConfig.value.logoUrl,
    maxQuestionsBeforeSolution: adminConfig.value.maxQuestionsBeforeSolution
  })
}

// updateFontSize function removed as it's not being used

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      previewLogoUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handlePreviewError = () => {
  previewLogoUrl.value = '/placeholder.svg'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      selectedFile.value = file
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        previewLogoUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
}

const processLogoFile = (file: File) => {
  // Set processing state
  isProcessingLogo.value = true

  // Validate file size (5MB limit - increased for better UX)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    isProcessingLogo.value = false
    return
  }

  // Validate file type
  if (!file.type.match(/image\/(png|jpeg|svg\+xml)/)) {
    alert('Please upload a PNG, JPG, or SVG file')
    isProcessingLogo.value = false
    return
  }

  // For SVG files, process directly
  if (file.type === 'image/svg+xml') {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      adminConfig.value.logoUrl = result
      updateAdminConfig()
      isProcessingLogo.value = false
    }
    reader.readAsDataURL(file)
    return
  }

  // For PNG/JPG files, resize to optimal dimensions
  const img = new Image()
  const reader = new FileReader()

  reader.onload = (e) => {
    img.src = e.target?.result as string
  }

  img.onload = () => {
    // Create canvas for resizing
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      alert('Failed to process image. Please try again.')
      return
    }

    // Calculate optimal size (44x44 for FAB, 32x32 for widget)
    // We'll create a 44x44 version that can be scaled down
    const targetSize = 44
    canvas.width = targetSize
    canvas.height = targetSize

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, targetSize, targetSize)

    // Calculate scaling to fit image within target size while maintaining aspect ratio
    const scale = Math.min(targetSize / img.width, targetSize / img.height)
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale

    // Center the image
    const x = (targetSize - scaledWidth) / 2
    const y = (targetSize - scaledHeight) / 2

    // Draw the resized image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

    // Convert to data URL
    const resizedImageUrl = canvas.toDataURL('image/png', 0.9)
    adminConfig.value.logoUrl = resizedImageUrl
    updateAdminConfig()
    isProcessingLogo.value = false
    selectedFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  img.onerror = () => {
    alert('Failed to load image. Please try a different file.')
    isProcessingLogo.value = false
    selectedFile.value = null
  }

  reader.readAsDataURL(file)
}

const confirmLogoUpload = () => {
  if (selectedFile.value) {
    processLogoFile(selectedFile.value)
  }
}

const cancelLogoUpload = () => {
  selectedFile.value = null
  previewLogoUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Studio methods
const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const setDeviceView = (device: string) => {
  deviceView.value = device
}

const openColorPicker = (type: 'primary' | 'secondary') => {
  if (type === 'primary') {
    primaryColorPicker.value?.click()
  } else {
    secondaryColorPicker.value?.click()
  }
}

const applyColorPreset = (preset: { primary: string; secondary: string }) => {
  adminConfig.value.primaryColor = preset.primary
  adminConfig.value.secondaryColor = preset.secondary
  updateAdminConfig()
}

const generateRandomColors = () => {
  const colors = [
    '#8b5cf6', '#d946ef', '#3b82f6', '#06b6d4', '#10b981', '#34d399',
    '#f59e0b', '#ef4444', '#ec4899', '#f97316', '#1f2937', '#374151'
  ]
  const primary = colors[Math.floor(Math.random() * colors.length)]
  const secondary = colors[Math.floor(Math.random() * colors.length)]

  adminConfig.value.primaryColor = primary
  adminConfig.value.secondaryColor = secondary
  updateAdminConfig()
}

const getColorVariants = (baseColor: string) => {
  // Generate color variants (lighter and darker shades)
  const variants = []
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Lighter variants
  for (let i = 1; i <= 3; i++) {
    const factor = 1 + (i * 0.2)
    const newR = Math.min(255, Math.round(r * factor))
    const newG = Math.min(255, Math.round(g * factor))
    const newB = Math.min(255, Math.round(b * factor))
    variants.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`)
  }

  // Darker variants
  for (let i = 1; i <= 3; i++) {
    const factor = 1 - (i * 0.15)
    const newR = Math.max(0, Math.round(r * factor))
    const newG = Math.max(0, Math.round(g * factor))
    const newB = Math.max(0, Math.round(b * factor))
    variants.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`)
  }

  return variants
}

const isPresetActive = (preset: { primary: string; secondary: string }) => {
  return adminConfig.value.primaryColor === preset.primary &&
         adminConfig.value.secondaryColor === preset.secondary
}

const getPresetDescription = (presetName: string) => {
  const descriptions: Record<string, string> = {
    'Purple Magic': 'Elegant & modern',
    'Ocean Blue': 'Calm & professional',
    'Emerald Green': 'Fresh & natural',
    'Sunset Orange': 'Warm & energetic',
    'Rose Pink': 'Playful & creative',
    'Midnight Dark': 'Sophisticated & bold'
  }
  return descriptions[presetName] || 'Beautiful combination'
}

const selectFont = (fontValue: string) => {
  adminConfig.value.fontFamily = fontValue
  updateAdminConfig()
}

const selectFontSize = (sizeValue: string) => {
  adminConfig.value.fontSize = sizeValue
  updateAdminConfig()
}

// Computed properties for preview
const previewStyles = computed(() => ({
  '--primary-color': adminConfig.value.primaryColor,
  '--secondary-color': adminConfig.value.secondaryColor,
  '--font-family': adminConfig.value.fontFamily,
  '--font-size': adminConfig.value.fontSize
}))

const embedCode = computed(() => {
  const configString = JSON.stringify(adminConfig.value).replace(/"/g, '&quot;')
  const scriptPart = '&lt;script src="https://your-domain.com/widget.js"&gt;&lt;/script&gt;'
  const divPart = '&lt;div id="egain-widget" data-config="' + configString + '"&gt;&lt;/div&gt;'
  return scriptPart + divPart
})

const copyEmbedCode = () => {
  navigator.clipboard.writeText(embedCode.value)
  // You could add a toast notification here
}

const exportConfig = () => {
  const configBlob = new Blob([JSON.stringify(adminConfig.value, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(configBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'widget-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

// These functions are available for future use in the admin panel
// const removeLogo = () => {
//   adminConfig.value.logoUrl = '/placeholder.svg'
//   updateAdminConfig()
// }

// const resetToDefault = () => {
//   adminConfig.value = {
//     primaryColor: '#8b5cf6',
//     secondaryColor: '#d946ef',
//     fontFamily: 'Inter, sans-serif',
//     fontSize: '16px',
//     logoUrl: '/eGainLogo.png',
//     maxQuestionsBeforeSolution: 3
//   }
//   updateAdminConfig()
// }

// const saveAdminConfig = () => {
//   // Save the admin config to the store
//   store.updateConfig(adminConfig.value)
//   closeAdminModal()
// }
</script>

<style scoped>
/* Main Widget Container */
.guidance-widget {
  position: fixed;
  top: var(--widget-y, 50px);
  left: var(--widget-x, auto);
  right: auto;
  z-index: 9999;
  font-family: var(--font-family);
  font-size: var(--font-size);
}

.widget-embedded {
  top: var(--widget-y, 50px);
  left: var(--widget-x, auto);
  right: auto;
  transition: top 0.3s ease, left 0.3s ease;
  will-change: transform;
}

.widget-container {
  width: 600px;
  height: 600px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(99, 102, 241, 0.08);
  backdrop-filter: blur(10px);
}

.widget-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.16);
}

.widget-container.dragging {
  cursor: grabbing;
  transition: none;
  transform: scale(1.02);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2);
}

/* Header */
.widget-header {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: relative;
  overflow: hidden;
}

.widget-header::before {
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
  flex-direction: column;
  gap: 4px;
  z-index: 1;
  position: relative;
}

.widget-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.widget-subtitle {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
  line-height: 1.4;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
  position: relative;
}

.admin-button,
.close-button {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  font-size: 16px;
}

.admin-button:hover,
.close-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.widget-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

/* Content Area */
.widget-content {
  flex: 1;
  overflow: hidden;
  background: #fafbfc;
  position: relative;
}

/* Floating Action Button */
.widget-fab {
  position: fixed;
  top: 15px;
  right: 15px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
  cursor: pointer;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid rgba(255, 255, 255, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5), 0 0 0 12px rgba(99, 102, 241, 0.1);
  }
}

.widget-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 16px 50px rgba(99, 102, 241, 0.4);
}

.widget-fab:active {
  transform: scale(0.95);
}

.fab-logo {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.fab-icon {
  color: white;
  font-size: 28px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Admin Modal */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.admin-modal {
  background: white;
  border-radius: 24px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.3);
  max-width: 1200px;
  width: 95%;
  max-height: 85vh;
  height: 85vh;
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Password Screen */
.admin-password-screen {
  padding: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 350px;
}

.password-header {
  margin-bottom: 32px;
}

.password-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.password-hint {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
  width: 100%;
}

.hint-icon {
  font-size: 20px;
}

.hint-text {
  color: #92400e;
  font-size: 14px;
  font-weight: 500;
}

.hint-text strong {
  color: #78350f;
  font-weight: 700;
}

.admin-modal-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.admin-modal-subtitle {
  color: #64748b;
  margin: 0 0 40px 0;
  font-size: 16px;
  line-height: 1.5;
}

.password-input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 320px;
}

.password-input {
  width: 100%;
  padding: 18px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
  font-weight: 500;
}

.password-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.password-submit-btn {
  width: 100%;
  padding: 18px 28px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.password-submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

.btn-icon {
  font-size: 18px;
}

.password-error {
  color: #dc2626;
  font-size: 14px;
  margin-top: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border: 1px solid #fca5a5;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 320px;
  width: 100%;
  font-weight: 500;
}

.error-icon {
  font-size: 16px;
}

.password-hint {
  color: var(--primary-color);
  font-size: 13px;
  margin: 12px 0 0 0;
  opacity: 0.8;
  font-style: italic;
}

/* Admin Settings Screen */
.admin-settings-screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

/* Studio Header */
.studio-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 24px 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.studio-icon {
  font-size: 32px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.studio-title h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.studio-title p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.device-controls {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
}

.device-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.device-btn.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.device-icon {
  font-size: 14px;
}

.close-studio-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-studio-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: scale(1.1);
}

/* Tab Navigation */
.tab-navigation {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 32px;
  display: flex;
  gap: 4px;
}

.tab-btn {
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 3px solid transparent;
  position: relative;
}

.tab-btn:hover {
  color: #1e293b;
  background: #f8fafc;
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: #f8fafc;
}

.tab-icon {
  font-size: 16px;
}

/* Studio Content */
.studio-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f8fafc;
}

.settings-panel {
  flex: 0 0 480px;
  padding: 24px;
  overflow-y: auto;
  background: white;
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.preview-panel {
  flex: 1;
  padding: 24px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  margin-bottom: 20px;
  text-align: center;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.preview-subtitle {
  font-size: 13px;
  color: #64748b;
}

.preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  margin: 0 auto;
  max-width: 400px;
  width: 100%;
}

.preview-widget {
  width: 100%;
  max-width: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-widget .preview-header {
  padding: 16px;
  color: white;
  text-align: center;
}

.preview-widget .preview-content {
  padding: 20px;
  background: white;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.5;
}

.close-admin-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  color: #64748b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-admin-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: scale(1.1);
}

.admin-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* Section Headers */
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 0;
  border-bottom: 2px solid #f1f5f9;
}

.section-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 10px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.section-header p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* Content Sections */
.tab-content {
  max-width: 100%;
}

.setting-group {
  margin-bottom: 32px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.setting-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

/* Enhanced Typography Cards */
.typography-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.typography-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.typography-header p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.font-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.font-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.font-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.font-card.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.font-card.active .font-name,
.font-card.active .font-description {
  color: white;
}

.font-preview {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.font-sample {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
}

.font-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.font-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.font-description {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.size-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.size-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.size-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.size-card.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.size-card.active .size-name,
.size-card.active .size-value {
  color: white;
}

.size-preview {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.size-sample {
  font-weight: 700;
  color: #1e293b;
}

.size-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.size-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.size-value {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  font-family: 'Monaco', 'Menlo', monospace;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.setting-description {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 16px;
  line-height: 1.4;
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 32px 0;
}

.live-preview {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 24px;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-content {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

/* Color Cards */
.color-cards-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.color-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.color-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.color-card-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.color-hex {
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  color: #64748b;
  font-weight: 500;
}

.color-preview-large {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-preview-large:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.color-card-content {
  padding: 20px;
}

.color-input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.color-hex-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.color-hex-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.color-variants {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-variant {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-variant:hover {
  transform: scale(1.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-input {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.color-picker {
  width: 48px;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-picker:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.color-text {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.color-text:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.color-text-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.color-text-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.font-select {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
  cursor: pointer;
}

.font-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.font-select:hover {
  border-color: #cbd5e1;
}

/* Button Styles */
.random-btn {
  padding: 10px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
}

.random-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-1px);
}

/* Enhanced Preset Cards */
.presets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.presets-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.presets-header p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.preset-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.preset-card:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.preset-card.active {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.preset-card.active .preset-name {
  color: white;
}

.preset-card.active .preset-description {
  color: rgba(255, 255, 255, 0.8);
}

.preset-preview {
  position: relative;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
}

.preset-gradient {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.preset-colors {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.preset-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preset-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.preset-description {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.font-size-control {
  display: flex;
  align-items: center;
  gap: 16px;
}

.font-size-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  accent-color: #6366f1;
  cursor: pointer;
}

.color-input input[type="color"] {
  width: 100%;
  height: 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.color-input input[type="color"]:hover {
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.font-input select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #1e293b;
}

.font-input select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.font-input input[type="range"] {
  width: 100%;
  margin: 12px 0;
  accent-color: var(--primary-color);
}

.font-size-display {
  font-size: 13px;
  color: #64748b;
  text-align: center;
  font-weight: 500;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.current-logo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logo-preview {
  width: 100%;
  height: 100px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-preview:hover {
  border-color: var(--primary-color);
  background: #f1f5f9;
}

.preview-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.logo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
}

.placeholder-icon {
  font-size: 24px;
}

.placeholder-text {
  font-size: 12px;
  font-weight: 500;
}

.logo-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.logo-dimensions,
.logo-position {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.logo-dimensions {
  color: #6366f1;
}

.logo-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-area {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #6366f1;
  background: #f1f5f9;
  transform: translateY(-1px);
}

.upload-area.processing {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.upload-area.processing:hover {
  transform: none;
  border-color: #e2e8f0;
  background: #f8fafc;
}

.upload-button-section {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.upload-logo-btn,
.cancel-upload-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-logo-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.upload-logo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.cancel-upload-btn {
  background: #f1f5f9;
  color: #64748b;
}

.cancel-upload-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-1px);
}

.upload-btn-icon {
  font-size: 16px;
  font-weight: bold;
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-loading .loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.upload-hint {
  font-size: 14px;
  color: #64748b;
}

.logo-requirements {
  margin-top: 16px;
  padding: 12px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.requirement-title {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.requirement-item {
  display: block;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 4px;
  line-height: 1.4;
}

.requirement-item:last-child {
  margin-bottom: 0;
}

.logo-actions {
  display: flex;
  gap: 12px;
}

.remove-logo-btn,
.reset-btn {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: #374151;
}

.remove-logo-btn {
  border-color: #ef4444;
  color: #ef4444;
}

.remove-logo-btn:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-1px);
}

.reset-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.admin-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
}

.save-btn,
.cancel-btn {
  flex: 1;
  padding: 16px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}



.cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.cancel-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-1px);
}

/* Responsive Design for Admin Panel */
@media (max-width: 768px) {
  .admin-header {
    padding: 20px 24px 0 24px;
  }

  .admin-title {
    font-size: 20px;
  }

  .admin-content {
    padding: 24px;
  }

  .setting-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .setting-group {
    margin-bottom: 32px;
  }

  .logo-preview {
    width: 60px;
    height: 60px;
  }

  .upload-area {
    padding: 24px 16px;
  }

  .upload-text {
    font-size: 14px;
  }

  .upload-hint {
    font-size: 12px;
  }

  .admin-actions {
    flex-direction: column;
    gap: 12px;
  }

  .save-btn,
  .cancel-btn {
    padding: 14px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .admin-header {
    padding: 16px 20px 0 20px;
  }

  .admin-content {
    padding: 20px;
  }

  .setting-title {
    font-size: 16px;
  }

  .setting-label {
    font-size: 12px;
  }

  .color-picker {
    width: 40px;
    height: 40px;
  }

  .color-text,
  .font-select {
    padding: 10px 12px;
    font-size: 13px;
  }

  .upload-area {
    padding: 20px 12px;
  }

  .upload-icon {
    font-size: 24px;
  }

  .upload-text {
    font-size: 13px;
  }

  .upload-hint {
    font-size: 11px;
  }
}

.save-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .widget-container {
    width: calc(100vw - 30px);
    height: 80vh;
    max-width: 500px;
  }

  .widget-embedded .widget-container {
    top: 15px;
    right: 15px;
    left: auto;
    width: calc(100vw - 30px);
    max-width: 400px;
    height: 80vh;
    border-radius: 20px;
  }

  .widget-header {
    padding: 20px;
  }

  .widget-title {
    font-size: 18px;
  }

  .widget-subtitle {
    font-size: 13px;
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
    padding: 24px;
  }

  .admin-password-screen {
    padding: 32px 24px;
  }

  .password-input-group {
    flex-direction: column;
  }

  .logo-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .widget-container {
    border-radius: 16px;
  }

  .widget-header {
    padding: 16px;
  }

  .admin-modal {
    border-radius: 16px;
  }

  .admin-content {
    padding: 20px;
  }
}

/* Animation for widget appearance */
.widget-open {
  animation: widgetSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes widgetSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Smooth scrolling for admin content */
.admin-content::-webkit-scrollbar {
  width: 6px;
}

.admin-content::-webkit-scrollbar-track {
  background: transparent;
}

.admin-content::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.2);
  border-radius: 3px;
}

.admin-content::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.4);
}

/* Enhanced Logo Preview Section */
.logo-preview-section {
  margin-top: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
}

.preview-header {
  margin-bottom: 16px;
  text-align: center;
}

.preview-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.preview-header p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.logo-preview-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
  text-align: center;
}

.preview-logo {
  margin-bottom: 12px;
}

.preview-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: white;
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.file-size {
  font-size: 12px;
  color: #64748b;
  font-family: 'Monaco', 'Menlo', monospace;
}

.upload-actions {
  display: flex;
  gap: 12px;
}

.upload-confirm-btn,
.upload-cancel-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-confirm-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.upload-confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.upload-cancel-btn {
  background: #f1f5f9;
  color: #64748b;
}

.upload-cancel-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-1px);
}

.upload-icon,
.cancel-icon {
  font-size: 16px;
  font-weight: bold;
}
</style>
