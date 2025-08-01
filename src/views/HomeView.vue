<script setup lang="ts">
import { ref } from 'vue'
import GuidanceWidget from '@/components/GuidanceWidget.vue'

const widgetRef = ref()

const widgetConfig = {
  primaryColor: '#9333ea',
  secondaryColor: '#f1f5f9',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  logoUrl: '/placeholder.svg',
  maxQuestionsBeforeSolution: 3
}

const toggleWidget = () => {
  if (widgetRef.value) {
    widgetRef.value.toggleOpen()
  }
}
</script>

<template>
  <div class="home-view">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">eGain</div>
        <nav class="navigation">
          <a href="#" class="nav-link">Solutions</a>
          <a href="#" class="nav-link">Products</a>
          <a href="#" class="nav-link">Resources</a>
          <a href="#" class="nav-link">Company</a>
          <a href="#" class="nav-link">Contact Us</a>
        </nav>
        <div class="header-actions">
          <div class="notification-icon">
            <div class="g-logo" @click="toggleWidget">
              <span class="g-text">G</span>
              <div class="notification-dot"></div>
              <span class="notification-count">0</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AI-Powered Knowledge for Customer Service</h1>
        <p class="hero-subtitle">Transform customer service with our AI knowledge platform.</p>
      </div>
    </section>

    <!-- Feature Section -->
    <section class="feature-section">
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon smart-conversations">
            <div class="icon-circle">
              <div class="chat-bubble"></div>
            </div>
          </div>
          <h3 class="feature-title">Smart Conversations</h3>
          <p class="feature-description">Engage customers with intelligent, context-aware responses powered by AI.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon knowledge-base">
            <div class="icon-circle">
              <div class="knowledge-icon"></div>
            </div>
          </div>
          <h3 class="feature-title">Knowledge Base</h3>
          <p class="feature-description">Access comprehensive information instantly with our advanced search capabilities.</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon availability">
            <div class="icon-circle">
              <div class="clock-icon"></div>
            </div>
          </div>
          <h3 class="feature-title">24/7 Availability</h3>
          <p class="feature-description">Provide round-the-clock support with automated intelligent assistance.</p>
        </div>
      </div>
    </section>

    <!-- Help Button -->
    <div class="help-button">
      <div class="help-icon">?</div>
    </div>

    <!-- Guidance Widget -->
    <GuidanceWidget 
      :embedded="true"
      :config="widgetConfig"
      ref="widgetRef"
    />
  </div>
</template>

<style scoped>
.home-view {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: white;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
}

.navigation {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #9333ea;
}

.header-actions {
  display: flex;
  align-items: center;
}

.notification-icon {
  position: relative;
}

.g-logo {
  width: 40px;
  height: 40px;
  background: #9333ea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.g-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
}

.g-text {
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.notification-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid white;
}

.notification-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
  padding: 80px 24px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

/* Feature Section */
.feature-section {
  padding: 80px 24px;
  background: #f8fafc;
}

.feature-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 48px;
}

.feature-card {
  text-align: center;
  padding: 40px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 24px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.smart-conversations .icon-circle {
  background: rgba(147, 51, 234, 0.1);
}

.knowledge-base .icon-circle {
  background: rgba(59, 130, 246, 0.1);
}

.availability .icon-circle {
  background: rgba(34, 197, 94, 0.1);
}

.chat-bubble {
  width: 32px;
  height: 24px;
  border: 2px solid #9333ea;
  border-radius: 12px;
  position: relative;
}

.chat-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 8px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #9333ea;
}

.knowledge-icon {
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border-radius: 4px;
  position: relative;
}

.knowledge-icon::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 2px;
}

.clock-icon {
  width: 24px;
  height: 24px;
  background: #22c55e;
  border-radius: 50%;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
}

/* Help Button */
.help-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
  z-index: 50;
}

.help-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.help-icon {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .navigation {
    gap: 16px;
  }
  
  .nav-link {
    font-size: 13px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .feature-card {
    padding: 32px 20px;
  }
}

@media (max-width: 480px) {
  .navigation {
    display: none;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
