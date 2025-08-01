(function() {
  'use strict';

  // Widget configuration
  const defaultConfig = {
    primaryColor: '#9333ea',
    secondaryColor: '#f1f5f9',
    fontFamily: 'Inter, sans-serif',
    fontSize: '16px',
    logoUrl: undefined,
    maxQuestionsBeforeSolution: 3
  };

  // Widget loader class
  class GuidanceWidgetLoader {
    constructor(config = {}) {
      this.config = { ...defaultConfig, ...config };
      this.widgetUrl = this.config.widgetUrl || 'http://localhost:5173';
      this.isLoaded = false;
      this.iframe = null;
    }

    // Initialize the widget
    init() {
      if (this.isLoaded) {
        console.warn('GuidanceWidget is already loaded');
        return;
      }

      // Create container if it doesn't exist
      let container = document.getElementById('egain-widget');
      if (!container) {
        container = document.createElement('div');
        container.id = 'egain-widget';
        document.body.appendChild(container);
      }

      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.src = `${this.widgetUrl}/widget`;
      this.iframe.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        z-index: 10000;
        background: white;
        display: none;
      `;

      // Add iframe to container
      container.appendChild(this.iframe);

      // Create floating action button
      this.createFAB();

      // Listen for messages from iframe
      this.setupMessageListener();

      this.isLoaded = true;
      console.log('GuidanceWidget loaded successfully');
    }

    // Create floating action button
    createFAB() {
      const fab = document.createElement('div');
      fab.id = 'egain-widget-fab';
      fab.innerHTML = '?';
      fab.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background-color: ${this.config.primaryColor};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        font-weight: bold;
        font-size: 20px;
        z-index: 9999;
        font-family: ${this.config.fontFamily};
      `;

      // Add hover effects
      fab.addEventListener('mouseenter', () => {
        fab.style.transform = 'scale(1.05)';
        fab.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
      });

      fab.addEventListener('mouseleave', () => {
        fab.style.transform = 'scale(1)';
        fab.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      });

      // Toggle widget visibility
      fab.addEventListener('click', () => {
        this.toggleWidget();
      });

      document.body.appendChild(fab);
      this.fab = fab;
    }

    // Toggle widget visibility
    toggleWidget() {
      if (this.iframe.style.display === 'none' || !this.iframe.style.display) {
        this.showWidget();
      } else {
        this.hideWidget();
      }
    }

    // Show widget
    showWidget() {
      this.iframe.style.display = 'block';
      this.fab.style.display = 'none';
      
      // Send config to iframe
      this.sendMessage('init', this.config);
    }

    // Hide widget
    hideWidget() {
      this.iframe.style.display = 'none';
      this.fab.style.display = 'flex';
    }

    // Send message to iframe
    sendMessage(type, data) {
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage({
          type,
          data
        }, this.widgetUrl);
      }
    }

    // Setup message listener
    setupMessageListener() {
      window.addEventListener('message', (event) => {
        // Verify origin
        if (event.origin !== this.widgetUrl) {
          return;
        }

        const { type, data } = event.data;

        switch (type) {
          case 'widget-close':
            this.hideWidget();
            break;
          case 'widget-ready':
            console.log('Widget is ready');
            break;
          case 'feedback-submitted':
            console.log('Feedback submitted:', data);
            // You can handle feedback here
            break;
        }
      });
    }

    // Destroy widget
    destroy() {
      if (this.fab) {
        this.fab.remove();
      }
      if (this.iframe) {
        this.iframe.remove();
      }
      this.isLoaded = false;
    }
  }

  // Global function to initialize widget
  window.initGuidanceWidget = function(config) {
    const loader = new GuidanceWidgetLoader(config);
    loader.init();
    return loader;
  };

  // Auto-initialize if data attribute is present
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.currentScript || document.querySelector('script[src*="widget.js"]');
    if (script && script.dataset.autoInit === 'true') {
      const config = {};
      
      // Parse data attributes
      if (script.dataset.primaryColor) config.primaryColor = script.dataset.primaryColor;
      if (script.dataset.secondaryColor) config.secondaryColor = script.dataset.secondaryColor;
      if (script.dataset.fontFamily) config.fontFamily = script.dataset.fontFamily;
      if (script.dataset.fontSize) config.fontSize = script.dataset.fontSize;
      if (script.dataset.logoUrl) config.logoUrl = script.dataset.logoUrl;
      if (script.dataset.widgetUrl) config.widgetUrl = script.dataset.widgetUrl;
      
      window.initGuidanceWidget(config);
    }
  });

})(); 