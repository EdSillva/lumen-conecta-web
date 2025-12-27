<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <p class="text-sm uppercase tracking-wide text-slate-500">Backoffice</p>
      <h1 class="text-2xl font-semibold text-slate-900">
        Aprovação de eventos
      </h1>
      <p class="text-sm text-slate-600">
        Somente administradores conseguem aprovar, rejeitar ou excluir.
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-2">
      <article
        v-for="event in pendingEvents"
        :key="event.id"
        class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900">
            {{ event.title }}
          </h2>
          <span
            class="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
            >PENDING</span
          >
        </div>
        <p class="mt-2 text-sm text-slate-700">{{ event.description }}</p>
        <p class="mt-3 text-xs text-slate-500">
          {{ event.date }} • {{ event.location }}
        </p>

        <div class="mt-4 flex gap-2">
          <button
            class="rounded bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="actionLoading[event.id]"
            @click="approve(event.id)"
          >
            Aprovar
          </button>
          <button
            class="rounded bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="actionLoading[event.id]"
            @click="reject(event.id)"
          >
            Rejeitar
          </button>
          <button
            class="rounded border border-slate-300 px-3 py-1 text-sm text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="actionLoading[event.id]"
            @click="removeEvent(event.id)"
          >
            Excluir
          </button>
        </div>
      </article>
    </div>

    <p v-if="loadError" class="text-sm text-rose-600">{{ loadError }}</p>
    <p v-if="pendingEvents.length === 0 && !loadError" class="text-sm text-slate-500">
      Nenhum evento pendente.
    </p>

    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900">Galerias</h2>
        <span class="text-xs text-slate-500">Edição e exclusão só aqui</span>
      </div>
      <ul class="mt-3 space-y-2 text-sm text-slate-700">
        <li
          v-for="gallery in galleries"
          :key="gallery.id"
          class="flex items-center justify-between"
        >
          <span>{{ gallery.title }}</span>
          <div class="flex gap-2">
            <button
              class="rounded border border-slate-300 px-3 py-1 hover:bg-slate-100"
            >
              Editar
            </button>
            <button
              class="rounded border border-rose-200 px-3 py-1 text-rose-700 hover:bg-rose-50"
            >
              Excluir
            </button>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import type { EventResponse } from '../../schemas/events';
import type { GallerySummary } from '../../schemas/galleries';
import { api } from '../../services/api';

const pendingEvents = ref<EventResponse[]>([]);
const galleries = ref<GallerySummary[]>([]);
const loadError = ref('');
const actionLoading = reactive<Record<string, boolean>>({});

async function loadPending() {
  loadError.value = '';
  try {
    pendingEvents.value = await api.get<EventResponse[]>('/backoffice/events/pending');
  } catch (err) {
    console.error(err);
    loadError.value = 'Não foi possível carregar eventos pendentes.';
  }
}

async function approve(id: string) {
  await runAction(id, async () => {
    await api.put(`/backoffice/events/${id}/approve`);
    pendingEvents.value = pendingEvents.value.filter((e) => e.id !== id);
  });
}

async function reject(id: string) {
  await runAction(id, async () => {
    await api.put(`/backoffice/events/${id}/reject`);
    pendingEvents.value = pendingEvents.value.filter((e) => e.id !== id);
  });
}

async function removeEvent(id: string) {
  await runAction(id, async () => {
    await api.del(`/backoffice/events/${id}`);
    pendingEvents.value = pendingEvents.value.filter((e) => e.id !== id);
  });
}

async function runAction(id: string, fn: () => Promise<void>) {
  actionLoading[id] = true;
  try {
    await fn();
  } catch (err) {
    console.error(err);
    loadError.value = 'Ação não concluída. Tente novamente.';
  } finally {
    actionLoading[id] = false;
  }
}

onMounted(() => {
  void loadPending();
});
</script>
