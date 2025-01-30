<template>
  <div id="app">
    <h1>noVNC Demo</h1>
    <VncViewer :url="vncUrl" :is-console-available="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VncViewer from './components/VncViewer.vue'

// Replace with your VNC server URL
const vncUrl = ref(new URL('wss://domain/api/consoles/id'))
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>