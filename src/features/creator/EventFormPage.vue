<template>
  <section class="max-w-3xl space-y-6">
    <div class="space-y-2">
      <p class="text-sm tracking-wide text-slate-500 uppercase">Criador</p>
      <h1 class="text-2xl font-semibold text-slate-900">
        {{ isEdit ? 'Editar evento' : 'Novo evento' }}
      </h1>
      <p class="text-sm text-slate-600">Envie para aprovação do backoffice.</p>
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="text-sm font-medium text-slate-800">Título</label>
        <input
          v-model="form.title"
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Nome do evento"
        />
        <p v-if="errors.title" class="mt-1 text-sm text-rose-600">
          {{ errors.title }}
        </p>
      </div>

      <div>
        <label class="text-sm font-medium text-slate-800">Descrição</label>
        <textarea
          v-model="form.description"
          class="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          rows="3"
          placeholder="Conte sobre o evento"
        />
        <p v-if="errors.description" class="mt-1 text-sm text-rose-600">
          {{ errors.description }}
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="text-sm font-medium text-slate-800">Data</label>
          <input
            v-model="form.date"
            class="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            type="date"
          />
          <p v-if="errors.date" class="mt-1 text-sm text-rose-600">
            {{ errors.date }}
          </p>
        </div>

        <div>
          <label class="text-sm font-medium text-slate-800">Local</label>
          <input
            v-model="form.location"
            class="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Cidade, Estado"
          />
          <p v-if="errors.location" class="mt-1 text-sm text-rose-600">
            {{ errors.location }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          :disabled="loading"
        >
          <span v-if="loading">Enviando...</span>
          <span v-else>{{ isEdit ? 'Salvar alterações' : 'Enviar para aprovação' }}</span>
        </button>
        <p class="text-sm text-slate-600">Status inicial: PENDING</p>
      </div>

      <p v-if="submitError" class="text-sm text-rose-600">{{ submitError }}</p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEventSchema, type EventResponse } from '../../schemas/events'

import { api } from '../../services/api'
import { useAuthStore } from '../auth/store/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isEdit = computed(() => Boolean(route.params.id))
const loading = ref(false)
const submitError = ref('')

const form = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
})

const errors = reactive<Record<string, string | undefined>>({})

async function onSubmit() {
  submitError.value = ''

  const result = createEventSchema.safeParse(form)
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors[issue.path.join('.')] = issue.message
    }
    return
  }

  if (!auth.user?.token) {
    submitError.value = 'Sessão expirada. Entre novamente.'
    return
  }

  loading.value = true
  try {
    console.log('[event] submitting', result.data)
    const created = await api.post<EventResponse>('/events', result.data)
    console.log('[event] created', created)
    void router.push({ name: 'events' })
  } catch (err) {
    console.error(err)
    submitError.value = 'Não foi possível enviar o evento.'
  } finally {
    loading.value = false
  }
}
</script>
