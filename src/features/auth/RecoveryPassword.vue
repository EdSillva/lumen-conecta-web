<template>
  <div class="bg-base-100 text-base-content min-h-screen">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <div class="w-full max-w-xl rounded-2xl border p-8 shadow-sm">
        <div class="mb-6 space-y-2">
          <p class="text-sm font-medium uppercase tracking-wide text-emerald-700">Acesso</p>
          <h1 class="text-2xl font-semibold">Entre com seu e-mail</h1>
          <p class="text-sm">
            Use seu e-mail e senha cadastrados. Depois do login você será redirecionado.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="email">E-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="seu@email.com"
              required
              class="0 text-base-300 w-full rounded-lg border px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div v-if="errorMessage" class="pb-4">
            <p class="text-error text-sm">{{ errorMessage }}</p>
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="my-btn flex w-full items-center justify-center px-4 py-2 text-sm font-semibold transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span v-if="auth.loading">Enviando email...</span>
            <span v-else>Recuperar Senha</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './store/auth'

const email = ref('')
const errorMessage = ref('')

const redirectPath = computed(() => (route.query.redirect as string | undefined) ?? '/')

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await auth.recoveryPassword(email.value.trim())
    await router.push(redirectPath.value)
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Email não encontrado. Verifique e tente novamente.'
  }
}
</script>
