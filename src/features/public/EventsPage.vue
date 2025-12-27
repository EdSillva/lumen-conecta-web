<template>
  <div class="bg-base-100">
    <header class="flex items-start justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-wide">Eventos</p>
        <h1 class="text-2xl font-semibold">Abertos ao público</h1>
        <p class="text-sm">Eventos aprovados pelo time de curadoria.</p>
      </div>
    </header>

    <button v-if="canCreate" class="my-btn mb-4 px-4 py-2" @click="goToCreate()">
      Criar evento
    </button>

    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="event in approvedEvents"
        :key="event.id"
        class="card bg-base-100 hover:border-base-300 w-96 cursor-pointer shadow-sm transition hover:-translate-y-1 hover:border hover:shadow-lg"
        @click="goToDetail(event.id)"
      >
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">
            {{ event.title }}
            <div class="badge badge-secondary">NEW</div>
          </h2>
          <p>
            {{ event.description }}
          </p>
          <p class="mt-3 text-xs">{{ event.date }} • {{ event.location }}</p>
          <div class="card-actions justify-end">
            <div class="badge badge-outline">Fashion</div>
            <div class="badge badge-outline">Products</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { EventSummary } from '@lumen/schemas'
import { useAuthStore } from '../auth/store/auth'
import { api } from '../../services/api'

const auth = useAuthStore()
const canCreate = computed(() => auth.isCreator || auth.isAdmin)
const router = useRouter()

const events = ref<EventSummary[]>([])
const approvedEvents = computed(() => events.value)
const loading = ref(true)
const loadError = ref('')

function goToCreate() {
  void router.push('/creator/events/new')
}

function goToDetail(id: string) {
  void router.push(`/events/${id}`)
}

onMounted(async () => {
  try {
    const data = await api.get<EventSummary[]>('/events')
    events.value = data
  } catch (err) {
    console.error('[EventsPage] failed to load events', err)
    loadError.value = 'Não foi possível carregar os eventos.'
  } finally {
    loading.value = false
  }
})
</script>
