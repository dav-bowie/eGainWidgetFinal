<script setup lang="ts">
import { ref } from 'vue'
import GuidanceWidget from '@/components/GuidanceWidget.vue'

const widgetRef = ref()

const widgetConfig = {
  primaryColor: '#9333ea',
  secondaryColor: '#f1f5f9',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  logoUrl: '/eGainLogo.png',
  maxQuestionsBeforeSolution: 3
}



const handleLogoError = (event: Event) => {
  console.warn('Header logo failed to load')
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
    // Fallback to text
    const logoDiv = target.parentElement
    if (logoDiv) {
      logoDiv.textContent = 'eGain'
      logoDiv.style.fontSize = '22px'
      logoDiv.style.fontWeight = '700'
      logoDiv.style.color = '#2563eb'
    }
  }
}


</script>

<template>
  <div class="home-view">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <img src="/eGainLogo.png" alt="eGain" class="logo-image" @error="handleLogoError" />
        </div>
        <nav class="navigation">
          <a href="#" class="nav-link">Solutions</a>
          <a href="#" class="nav-link">Products</a>
          <a href="#" class="nav-link">Resources</a>
          <a href="#" class="nav-link">Company</a>
          <a href="#" class="nav-link">Contact Us</a>
        </nav>
        <div class="header-actions">
          <!-- Widget will be positioned here -->
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

      <!-- Additional Content Section -->
      <section class="content-section">
        <div class="content-container">
          <h2 class="section-title">Knowledge everywhere for customer self-service, contact centers, and employees</h2>
          <p class="section-description">
            Customer service automation depends on trusted answers from a single source of truth in the enterprise.
            The eGain suite unifies knowledge silos and transforms the content by orchestrating GenAI and experts.
            The result: correct, consistent, and compliant answers that are trusted and consumed by customers, agents, and employees.
          </p>
        </div>
      </section>

      <!-- Hub Cards Section -->
      <section class="hub-section">
        <div class="hub-grid">
          <div class="hub-card">
            <div class="hub-icon">
              <div class="icon-bubble">
                <div class="starburst"></div>
              </div>
            </div>
            <h3 class="hub-title">AI Agent</h3>
            <p class="hub-description">Conversational guidance for customers, agents, and employees</p>
            <a href="#" class="hub-link">Read more →</a>
          </div>

          <div class="hub-card">
            <div class="hub-icon">
              <div class="icon-book">
                <div class="starburst"></div>
              </div>
              <div class="badges">
                <span class="badge kcs-verified">KCS VERIFIED</span>
                <span class="badge kcs-v6">KCS v6</span>
              </div>
            </div>
            <h3 class="hub-title">AI Knowledge Hub</h3>
            <p class="hub-description">Eliminate knowledge and content silos, and guide users to trusted answers</p>
            <a href="#" class="hub-link">Read more →</a>
          </div>

          <div class="hub-card">
            <div class="hub-icon">
              <div class="icon-conversation">
                <div class="starburst"></div>
              </div>
            </div>
            <h3 class="hub-title">Conversation Hub</h3>
            <p class="hub-description">Deliver personalized digital engagement to customers across touchpoints</p>
            <a href="#" class="hub-link">Read more →</a>
          </div>

          <div class="hub-card">
            <div class="hub-icon">
              <div class="icon-analytics">
                <div class="starburst"></div>
              </div>
            </div>
            <h3 class="hub-title">Analytics Hub</h3>
            <p class="hub-description">Measure, manage, and optimize contact center operations</p>
            <a href="#" class="hub-link">Read more →</a>
          </div>
        </div>
      </section>

      <!-- Customer Stories Section -->
      <section class="stories-section">
        <div class="stories-container">
          <h2 class="section-title">Customer Success Stories</h2>
          <div class="stories-grid">
            <div class="story-card">
              <div class="story-image">
                <div class="placeholder-image"></div>
              </div>
              <h3 class="story-title">Global Bank Transformation</h3>
              <p class="story-excerpt">How a leading bank reduced support costs by 40% while improving customer satisfaction.</p>
              <a href="#" class="story-link">Watch customer story →</a>
            </div>

            <div class="story-card">
              <div class="story-image">
                <div class="placeholder-image"></div>
              </div>
              <h3 class="story-title">E-commerce Innovation</h3>
              <p class="story-excerpt">Revolutionizing customer support with AI-powered knowledge management.</p>
              <a href="#" class="story-link">Watch customer story →</a>
            </div>

            <div class="story-card">
              <div class="story-image">
                <div class="placeholder-image"></div>
              </div>
              <h3 class="story-title">Healthcare Excellence</h3>
              <p class="story-excerpt">Delivering accurate medical information with AI-enhanced knowledge systems.</p>
              <a href="#" class="story-link">Watch customer story →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="trust-section">
        <div class="trust-container">
          <h2 class="section-title">Trusted by Industry Leaders</h2>
          <div class="trust-grid">
            <div class="trust-item">
              <div class="trust-icon">🏆</div>
              <h3 class="trust-title">Enterprise Grade</h3>
              <p class="trust-description">Built for scale with enterprise-level security and compliance</p>
            </div>
            <div class="trust-item">
              <div class="trust-icon">🔒</div>
              <h3 class="trust-title">Secure & Compliant</h3>
              <p class="trust-description">SOC 2, GDPR, and HIPAA compliant with end-to-end encryption</p>
            </div>
            <div class="trust-item">
              <div class="trust-icon">⚡</div>
              <h3 class="trust-title">High Performance</h3>
              <p class="trust-description">99.9% uptime with sub-second response times</p>
            </div>
          </div>
        </div>
      </section>
    </main>



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
  background: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  position: relative;
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
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-image {
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block;
  max-width: 100%;
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



/* Main Content */
.main-content {
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
  max-width: 1200px;
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
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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



/* Responsive Design */
@media (max-width: 1200px) {
  .header-content {
    padding: 0 16px;
  }

  .feature-grid {
    padding: 0 16px;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

  .content-container,
  .hub-grid,
  .stories-container,
  .trust-container {
    padding: 0 16px;
  }

  .hub-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .stories-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .trust-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 10px 0;
  }

  .header-content {
    padding: 0 12px;
  }

  .logo-image {
    height: 28px;
  }

  .navigation {
    gap: 16px;
  }

  .nav-link {
    font-size: 13px;
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

  .logo-image {
    height: 24px;
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

  .content-section,
  .hub-section,
  .stories-section,
  .trust-section {
    padding: 60px 12px;
  }

  .section-title {
    font-size: 2rem;
  }

  .hub-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .trust-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .hub-card {
    padding: 24px 20px;
  }

  .story-card {
    margin-bottom: 20px;
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
    max-width: 1400px;
    padding: 0 40px;
  }

  .feature-grid {
    max-width: 1400px;
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
    max-width: 1600px;
    padding: 0 60px;
  }

  .feature-grid {
    max-width: 1600px;
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

/* Additional Content Section */
.content-section {
  padding: 80px 20px;
  background: white;
  text-align: center;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
  line-height: 1.2;
}

.section-description {
  font-size: 1.125rem;
  color: #6b7280;
  line-height: 1.7;
  max-width: 800px;
  margin: 0 auto;
}

/* Hub Cards Section */
.hub-section {
  padding: 80px 20px;
  background: #f8fafc;
}

.hub-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.hub-card {
  background: white;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  position: relative;
}

.hub-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.hub-icon {
  position: relative;
  margin-bottom: 20px;
}

.icon-bubble, .icon-book, .icon-conversation, .icon-analytics {
  width: 48px;
  height: 48px;
  border: 2px solid #1f2937;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bubble {
  border-radius: 50%;
}

.icon-conversation {
  border-radius: 12px;
}

.starburst {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 16px;
  height: 16px;
  background: #9333ea;
  border-radius: 50%;
}

.badges {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  color: white;
}

.badge.kcs-verified {
  background: #ef4444;
}

.badge.kcs-v6 {
  background: #3b82f6;
}

.hub-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.hub-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 20px 0;
  font-size: 0.95rem;
}

.hub-link {
  color: #9333ea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.hub-link:hover {
  color: #7c3aed;
}

/* Customer Stories Section */
.stories-section {
  padding: 80px 20px;
  background: white;
}

.stories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.story-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.story-image {
  height: 200px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-image {
  width: 60px;
  height: 60px;
  background: #d1d5db;
  border-radius: 8px;
  opacity: 0.5;
}

.story-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  padding: 24px 24px 12px 24px;
}

.story-excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  padding: 0 24px 20px 24px;
  font-size: 0.95rem;
}

.story-link {
  color: #9333ea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0 24px 24px 24px;
  display: block;
  transition: color 0.2s ease;
}

.story-link:hover {
  color: #7c3aed;
}

/* Trust Section */
.trust-section {
  padding: 80px 20px;
  background: #f8fafc;
}

.trust-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.trust-item {
  text-align: center;
  padding: 32px 20px;
}

.trust-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.trust-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.trust-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}
</style>
