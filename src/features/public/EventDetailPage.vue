<template>
  <section class="space-y-4">
    <button class="text-sm text-slate-600 hover:text-slate-900" type="button" @click="goBack">
      ← Voltar
    </button>
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-xs font-medium tracking-wide text-emerald-700 uppercase">Evento aprovado</p>
      <h1 class="mt-2 text-2xl font-semibold text-slate-900">
        {{ event.title }}
      </h1>
      <p class="mt-2 text-slate-700">{{ event.description }}</p>
      <p class="mt-4 text-sm text-slate-600">{{ event.date }} • {{ event.location }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { EventSummary } from '../../schemas'

const route = useRoute()
const router = useRouter()
const event = computed<EventSummary>(() => ({
  id: String(route.params.id),
  title: 'Evento demonstrativo',
  description: 'Página de detalhes ainda conectada a dados mockados.',
  date: '2025-01-20',
  location: 'São Paulo, SP',
}))

function goBack() {
  void router.push({ name: 'events' })
}
</script>
