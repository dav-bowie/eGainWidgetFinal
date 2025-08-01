<template>
  <div class="widget-view">
    <GuidanceWidget 
      :embedded="true"
      :config="widgetConfig"
    />
  </div>
</template>

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

<style>
.widget-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

/* Reset any global styles that might interfere */
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style> 