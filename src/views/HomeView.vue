<script setup lang="ts">
import GuidanceWidget from '@/components/GuidanceWidget.vue'

const widgetConfig = {
  primaryColor: '#9333ea',
  secondaryColor: '#f1f5f9',
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  logoUrl: '/placeholder.svg',
  maxQuestionsBeforeSolution: 3
}
</script>

<template>
  <div class="home-view">
    <!-- Demo Page Content -->
    <div class="demo-page">
      <header class="demo-header">
        <h1>eGain Interactive Guidance Widget Demo</h1>
        <p>Experience the interactive guidance system in action</p>
      </header>
      
      <main class="demo-content">
        <div class="demo-section">
          <h2>How it works</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <div class="feature-icon">📝</div>
              <h3>Problem Description</h3>
              <p>Start by describing your issue in detail</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">❓</div>
              <h3>Smart Questions</h3>
              <p>Answer targeted questions to narrow down solutions</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">💡</div>
              <h3>Personalized Solution</h3>
              <p>Get a tailored solution based on your responses</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⭐</div>
              <h3>Feedback</h3>
              <p>Help us improve by rating your experience</p>
            </div>
          </div>
        </div>
        
        <div class="demo-section">
          <h2>Try it out</h2>
          <p>Click the widget button in the bottom right to start your guided experience.</p>
        </div>
      </main>
    </div>

    <!-- Guidance Widget -->
    <GuidanceWidget 
      :embedded="true"
      :config="widgetConfig"
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.demo-page {
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.demo-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-header p {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
}

.demo-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section:last-child {
  margin-bottom: 0;
}

.demo-section h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 24px 0;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.feature-card {
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.demo-section p {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .demo-content {
    padding: 24px;
  }
  
  .demo-section h2 {
    font-size: 1.5rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .feature-icon {
    font-size: 2.5rem;
  }
}
</style>
