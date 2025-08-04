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

    <!-- Main Content -->
    <main class="main-content">
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
    </main>

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
  display: flex;
  flex-direction: column;
  width: 100vw;
  overflow-x: hidden;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
  width: 100%;
}

.header-content {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #2563eb;
}

.navigation {
  display: flex;
  gap: 24px;
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
  width: 36px;
  height: 36px;
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
  font-size: 16px;
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

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
  padding: 60px 20px;
  text-align: center;
  color: white;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 100%;
}

.hero-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

/* Feature Section */
.feature-section {
  padding: 60px 20px;
  background: #f8fafc;
  flex-shrink: 0;
  width: 100%;
}

.feature-grid {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 20px;
}

.icon-circle {
  width: 70px;
  height: 70px;
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
  width: 28px;
  height: 20px;
  border: 2px solid #9333ea;
  border-radius: 10px;
  position: relative;
}

.chat-bubble::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 6px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #9333ea;
}

.knowledge-icon {
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 3px;
  position: relative;
}

.knowledge-icon::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 1px;
}

.clock-icon {
  width: 20px;
  height: 20px;
  background: #22c55e;
  border-radius: 50%;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

/* Help Button */
.help-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
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
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-content {
    padding: 0 16px;
  }
  
  .feature-grid {
    padding: 0 16px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  
  .hero-section {
    padding: 50px 16px;
  }
  
  .feature-section {
    padding: 50px 16px;
  }
  
  .hero-content {
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 10px 0;
  }
  
  .header-content {
    padding: 0 12px;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .navigation {
    gap: 16px;
  }
  
  .nav-link {
    font-size: 13px;
  }
  
  .g-logo {
    width: 32px;
    height: 32px;
  }
  
  .g-text {
    font-size: 14px;
  }
  
  .hero-section {
    padding: 40px 12px;
    min-height: 40vh;
  }
  
  .hero-title {
    margin-bottom: 16px;
  }
  
  .feature-section {
    padding: 40px 12px;
  }
  
  .feature-grid {
    padding: 0 12px;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 24px 16px;
  }
  
  .icon-circle {
    width: 60px;
    height: 60px;
  }
  
  .chat-bubble {
    width: 24px;
    height: 18px;
  }
  
  .knowledge-icon,
  .clock-icon {
    width: 18px;
    height: 18px;
  }
  
  .feature-title {
    font-size: 1.1rem;
  }
  
  .feature-description {
    font-size: 0.9rem;
  }
  
  .help-button {
    width: 40px;
    height: 40px;
    bottom: 16px;
    right: 16px;
  }
  
  .help-icon {
    font-size: 14px;
  }
  
  .hero-content {
    padding: 0 12px;
  }
}

@media (max-width: 480px) {
  .navigation {
    display: none;
  }
  
  .header-content {
    padding: 0 8px;
  }
  
  .logo {
    font-size: 18px;
  }
  
  .hero-section {
    padding: 30px 8px;
    min-height: 35vh;
  }
  
  .hero-title {
    margin-bottom: 12px;
  }
  
  .feature-section {
    padding: 30px 8px;
  }
  
  .feature-grid {
    padding: 0 8px;
  }
  
  .feature-card {
    padding: 20px 12px;
  }
  
  .icon-circle {
    width: 50px;
    height: 50px;
  }
  
  .chat-bubble {
    width: 20px;
    height: 16px;
  }
  
  .knowledge-icon,
  .clock-icon {
    width: 16px;
    height: 16px;
  }
  
  .feature-title {
    font-size: 1rem;
    margin-bottom: 8px;
  }
  
  .feature-description {
    font-size: 0.85rem;
  }
  
  .help-button {
    width: 36px;
    height: 36px;
    bottom: 12px;
    right: 12px;
  }
  
  .help-icon {
    font-size: 12px;
  }
  
  .hero-content {
    padding: 0 8px;
  }
}

/* Tablet Landscape */
@media (min-width: 769px) and (max-width: 1024px) {
  .hero-section {
    padding: 50px 20px;
    min-height: 45vh;
  }
  
  .feature-grid {
    padding: 0 20px;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }
  
  .feature-card {
    padding: 28px 20px;
  }
  
  .hero-content {
    padding: 0 20px;
  }
}

/* Large Desktop */
@media (min-width: 1400px) {
  .header-content {
    max-width: 1600px;
    padding: 0 40px;
  }
  
  .feature-grid {
    max-width: 1600px;
    padding: 0 40px;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
  }
  
  .hero-section {
    padding: 80px 40px;
    min-height: 60vh;
  }
  
  .feature-section {
    padding: 80px 40px;
  }
  
  .feature-card {
    padding: 40px 30px;
  }
  
  .icon-circle {
    width: 80px;
    height: 80px;
  }
  
  .hero-content {
    padding: 0 40px;
  }
}

/* Extra Large Desktop */
@media (min-width: 1920px) {
  .header-content {
    max-width: 1800px;
    padding: 0 60px;
  }
  
  .feature-grid {
    max-width: 1800px;
    padding: 0 60px;
    gap: 50px;
  }
  
  .hero-section {
    padding: 100px 60px;
    min-height: 70vh;
  }
  
  .feature-section {
    padding: 100px 60px;
  }
  
  .feature-card {
    padding: 50px 40px;
  }
  
  .icon-circle {
    width: 90px;
    height: 90px;
  }
  
  .hero-content {
    padding: 0 60px;
  }
}
</style>
