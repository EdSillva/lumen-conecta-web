<template>
  <div class="bg-base-100 text-base-content min-h-screen">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <!-- logo com um tamanho fixo -->
      <div class="flex justify-center">
        <img class="h-64" src="../../assets/logo.png" alt="" />
      </div>
      <div class="w-full max-w-xl rounded-2xl border p-8 shadow-sm">
        <div class="mb-6 space-y-2 text-center">
          <h1 class="text-2xl font-semibold">Entre com seu e-mail</h1>
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
              class="0 text-base-300 w-full rounded-lg border px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="password">Senha</label>
            <input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="*******"
              required
              class="b0 text-base-300 w-full rounded-lg border px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
          </div>

          <div v-if="errorMessage" class="pb-4">
            <p class="text-error text-sm">{{ errorMessage }}</p>
          </div>

          <div class="pb-8">
            Esqueceu a senha?
            <router-link to="/recovery-password" class="text-emerald-600 hover:underline"
              >Recupere aqui</router-link
            >
          </div>

          <button
            type="submit"
            :disabled="auth.loading"
            class="my-btn flex w-full items-center justify-center px-4 py-2 text-sm font-semibold transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span v-if="auth.loading">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
        </form>

        <div class="py-8">
          Ainda não tem cadastro?
          <router-link to="/register" class="text-emerald-600 hover:underline"
            >Cadastre-se aqui</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from './store/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const redirectPath = computed(() => (route.query.redirect as string | undefined) ?? '/')

const handleSubmit = async () => {
  errorMessage.value = ''
  try {
    await auth.loginWithEmailPassword(email.value.trim(), password.value.trim())
    await router.push(redirectPath.value)
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Não foi possível entrar. Verifique e-mail e senha.'
  }
}
</script>
