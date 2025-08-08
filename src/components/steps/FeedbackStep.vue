<template>
  <div class="feedback-step">
    <div class="step-content">
      <div class="step-header">
        <h3 class="step-title">How was your experience?</h3>
        <p class="step-description">
          Your feedback helps us improve our service.
        </p>
      </div>

      <!-- Rating Summary -->
      <div class="rating-summary">
        <div class="average-rating">
          <div class="rating-number">4.5</div>
          <div class="star-rating" aria-label="4.5 out of 5">
            <svg class="star filled" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="star filled" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="star filled" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="star filled" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg class="star half" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="review-count">120 reviews</div>
        </div>

        <div class="rating-distribution">
          <div class="distribution-item">
            <span class="star-label">5</span>
            <div class="distribution-bar">
              <div class="bar-fill" style="width: 40%"></div>
            </div>
            <span class="percentage">40%</span>
          </div>
          <div class="distribution-item">
            <span class="star-label">4</span>
            <div class="distribution-bar">
              <div class="bar-fill" style="width: 30%"></div>
            </div>
            <span class="percentage">30%</span>
          </div>
          <div class="distribution-item">
            <span class="star-label">3</span>
            <div class="distribution-bar">
              <div class="bar-fill" style="width: 15%"></div>
            </div>
            <span class="percentage">15%</span>
          </div>
          <div class="distribution-item">
            <span class="star-label">2</span>
            <div class="distribution-bar">
              <div class="bar-fill" style="width: 10%"></div>
            </div>
            <span class="percentage">10%</span>
          </div>
          <div class="distribution-item">
            <span class="star-label">1</span>
            <div class="distribution-bar">
              <div class="bar-fill" style="width: 5%"></div>
            </div>
            <span class="percentage">5%</span>
          </div>
        </div>
      </div>

      <!-- User Rating -->
      <div class="user-rating-section">
        <h4 class="rating-title">Rate your experience</h4>
        <div class="star-input">
          <button
            v-for="star in 5"
            :key="star"
            class="star-button"
            :class="{
              'filled': star <= userRating,
              'hovered': star <= hoverRating
            }"
            @click="setRating(star)"
            @mouseenter="hoverRating = star"
            @mouseleave="hoverRating = 0"
            :aria-label="`Rate ${star} star${star > 1 ? 's' : ''}`"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        </div>
        <div class="rating-label">
          {{ getRatingLabel(userRating) }}
        </div>
      </div>

      <!-- Additional Feedback -->
      <div class="additional-feedback">
        <label for="feedback-comment" class="feedback-label">
          Additional comments (optional)
        </label>
        <textarea
          id="feedback-comment"
          v-model="feedbackComment"
          class="feedback-textarea"
          placeholder="Share your thoughts..."
          rows="4"
          maxlength="500"
        ></textarea>
        <div class="character-count">
          {{ feedbackComment.length }}/500 characters
        </div>
      </div>

      <!-- Step Actions -->
      <div class="step-actions">
        <button
          class="submit-button"
          :disabled="!canSubmit"
          @click="handleSubmit"
        >
          Submit
        </button>
        <button
          class="skip-button"
          @click="handleSkip"
        >
          Skip
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWidgetStore } from '@/stores/widget'

const emit = defineEmits<{
  complete: []
}>()

const store = useWidgetStore()

// State
const userRating = ref(0)
const hoverRating = ref(0)
const feedbackComment = ref('')

// Computed
const canSubmit = computed(() => {
  return userRating.value > 0
})

// Methods
const setRating = (rating: number) => {
  userRating.value = rating
}

const getRatingLabel = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'Poor'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
      return 'Very Good'
    case 5:
      return 'Excellent'
    default:
      return 'Select a rating'
  }
}

const handleSubmit = async () => {
  // Save feedback to store
  await store.saveFeedback({
    helpful: store.feedback.helpful,
    rating: userRating.value,
    comment: feedbackComment.value.trim() || undefined
  })

  emit('complete')
}

const handleSkip = () => {
  emit('complete')
}
</script>

<style scoped>
.feedback-step {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

/* Rating Summary */
.rating-summary {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.average-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.rating-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}

.star-rating {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1;         /* kill inherited line-height */
  letter-spacing: 0;      /* kill inherited tracking */
  font-size: 0;           /* remove inline-block whitespace if you use spans */
}

.star {
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  fill: #e1e5e9;
}

.star.filled {
  fill: #fbbf24;
}

.star.half {
  position: relative;
}

.star.half path {
  clip-path: inset(0 50% 0 0);
}

.review-count {
  font-size: 12px;
  color: #666;
}

.rating-distribution {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.star-label {
  min-width: 12px;
  color: #666;
}

.distribution-bar {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #fbbf24;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.percentage {
  min-width: 30px;
  text-align: right;
  color: #666;
}

/* User Rating */
.user-rating-section {
  text-align: center;
  padding: 20px;
  background: var(--secondary-color);
  border-radius: 8px;
}

.rating-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.star-input {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  line-height: 1;         /* kill inherited line-height */
  letter-spacing: 0;      /* kill inherited tracking */
  font-size: 0;           /* remove inline-block whitespace */
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-button svg {
  width: 32px;
  height: 32px;
  fill: #e1e5e9;
  transition: all 0.2s ease;
}

.star-button:hover svg,
.star-button.hovered svg {
  fill: #fbbf24;
  transform: scale(1.1);
}

.star-button.filled svg {
  fill: #fbbf24;
}

.rating-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* Additional Feedback */
.additional-feedback {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.feedback-textarea {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.feedback-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

.feedback-textarea::placeholder {
  color: #999;
}

.character-count {
  font-size: 12px;
  color: #666;
  text-align: right;
}

/* Step Actions */
.step-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e1e5e9;
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #7c3aed;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.skip-button {
  background: transparent;
  color: #666;
  border: 1px solid #e1e5e9;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skip-button:hover {
  background: #f8f9fa;
  border-color: #d1d5db;
}

/* Accessibility */
.star-button:focus-visible,
.submit-button:focus-visible,
.skip-button:focus-visible,
.feedback-textarea:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Responsive */
@media (max-width: 480px) {
  .rating-summary {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .average-rating {
    min-width: auto;
  }

  .star-input {
    gap: 4px;
  }

  .star-button svg {
    width: 28px;
    height: 28px;
  }

  .step-actions {
    flex-direction: column;
  }
}
</style>
