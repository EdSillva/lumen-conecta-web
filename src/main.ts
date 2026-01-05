import { createPinia } from 'pinia'
import { createApp } from 'vue'

import './assets/main.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './features/auth/store/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Initialize auth listener to hydrate user/roles from Firebase persistence
useAuthStore().init()

app.mount('#app')
