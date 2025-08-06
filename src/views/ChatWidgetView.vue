<template>
  <div class="chat-widget-demo">
    <header class="demo-header">
      <div class="container">
        <h1>AI Guidance Chat Widget</h1>
        <p>Modern chat interface for interactive AI guidance</p>
      </div>
    </header>

    <main class="demo-content">
      <div class="container">
        <div class="demo-section">
          <h2>Features</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Interactive conversation with AI assistant</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3>Customizable</h3>
              <p>Admin panel for colors, fonts, and branding</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3>Responsive</h3>
              <p>Works perfectly on all devices</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <h3>Draggable</h3>
              <p>Move the widget anywhere on the page</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🖼️</div>
              <h3>Image Responses</h3>
              <p>Get visual options based on your queries</p>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h2>Try the Chat Widget</h2>
          <p>Click the floating button in the top-right corner to start a conversation with the AI assistant.</p>
          <div class="demo-info">
            <div class="info-card">
              <h4>How it works:</h4>
                             <ul>
                 <li>Describe your problem or ask a question</li>
                 <li>Get intelligent responses with image options</li>
                 <li>Try keywords like "hardware", "software", "network"</li>
                 <li>Continue the conversation naturally</li>
                 <li>Access admin settings with password: <code>admin123</code></li>
               </ul>
            </div>
          </div>
        </div>

        <div class="demo-section">
          <h2>Implementation</h2>
          <div class="code-example">
            <h4>Embed the widget on any website:</h4>
            <pre><code>&lt;script src="widget.js"&gt;&lt;/script&gt;
&lt;script&gt;
  initGuidanceWidget({
    primaryColor: '#6366f1',
    secondaryColor: '#ec4899',
    logoUrl: '/your-logo.png'
  });
&lt;/script&gt;</code></pre>
          </div>
        </div>
      </div>
    </main>

    <!-- Chat Widget -->
    <ChatWidget :embedded="true" />
  </div>
</template>

<script setup lang="ts">
import ChatWidget from '@/components/ChatWidget.vue'
</script>

<style scoped>
.chat-widget-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

.demo-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 60px 0;
  text-align: center;
  color: white;
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
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.demo-section {
  margin-bottom: 80px;
}

.demo-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 40px 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-section p {
  font-size: 1.1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.feature-card p {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

.demo-info {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.info-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
}

.info-card h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  padding: 8px 0;
  position: relative;
  padding-left: 24px;
}

.info-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

.info-card code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.code-example {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 30px;
  margin-top: 30px;
}

.code-example h4 {
  color: white;
  font-size: 1.2rem;
  margin: 0 0 20px 0;
}

.code-example pre {
  background: #1e293b;
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin: 0;
}

.code-example code {
  color: #e2e8f0;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }

  .demo-header p {
    font-size: 1rem;
  }

  .demo-section h2 {
    font-size: 2rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
