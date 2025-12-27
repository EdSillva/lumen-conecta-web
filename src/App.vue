<template>
  <div class="bg-base-100 text-base-content min-h-screen">
    <NavBar v-if="showNav" />
    <main :class="mainClass">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import NavBar from './components/navigation/NavBar.vue'

const route = useRoute()

const showNav = computed(() => {
  const routes = ['login', 'register', 'recovery-password']
  return !routes.includes(route.name as string)
})

// Na home, a hero deve ocupar a largura total e encostar no topo,
// então não usamos container nem padding. Nas demais rotas mantemos o layout centralizado.
const mainClass = computed(() => (route.name === 'home' ? '' : 'mx-auto max-w-6xl px-4 py-8'))
</script>
