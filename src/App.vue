<template>
  <div id="app">
    <VncViewer v-if="vncUrl" :url="vncUrl" :is-console-available="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import VncViewer from './components/VncViewer.vue'

const payload = {
  "vmId": "f5052cf5-6d9e-a785-2aee-9c971baf1ff3"
}

const vncUrl = ref<URL | null>(null) 

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/generate-console-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    })

    if (response.ok) {
      const data = await response.json()
      console.log("Response Data:", data)

      if (data.consoleUrl) {
        console.log("Console URL:", data.consoleUrl)

        vncUrl.value = data.consoleUrl
      } else {
        console.error("Console URL is missing in response")
      }

      console.log("Static token stored in cookies")
    } else {
      console.error("Failed to set token")
    }
  } catch (error) {
    console.error("Error setting token:", error)
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin-top: 60px;
}
</style>
