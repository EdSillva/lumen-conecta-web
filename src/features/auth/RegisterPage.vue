<template>
  <div class="bg-base-100 text-base-content min-h-screen">
    <div class="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <div class="w-full max-w-xl rounded-2xl border p-8 shadow-sm">
        <div class="mb-6 space-y-2">
          <p class="text-sm font-medium tracking-wide text-emerald-700 uppercase">Cadastro</p>
          <h1 class="text-2xl font-semibold">Crie sua conta</h1>
          <p class="text-sm">
            Use seu e-mail e senha para se cadastrar. Depois do registro você será redirecionado.
          </p>
        </div>

        <!-- Formulário de registro -->
        <form action="" @submit.prevent="handleRegister">
          <div class="gap-4 space-y-4">
            <InputForms
              label="Nome"
              type="text"
              placeholder="Digite seu nome"
              v-model="form.name"
            />
            <InputForms
              label="E-mail"
              type="email"
              placeholder="Digite seu e-mail"
              v-model="form.email"
            />
            <InputForms
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              v-model="form.password"
            />
            <InputForms
              label="Papel"
              type="select"
              placeholder="Selecione seu papel"
              v-model="form.roles"
            >
              <template #options>
                <option v-for="role in roleOptions" :key="role.value" :value="role.value">
                  {{ role.label }}
                </option>
              </template>
            </InputForms>
          </div>

          <div class="py-8">
            <button type="submit" :disabled="auth.loading" class="btn btn-primary w-full">
              <span v-if="auth.loading">Criando conta...</span>
              <span v-else>Criar conta</span>
            </button>
          </div>
        </form>

        <div class="py-8">
          Já tem tem cadastro?
          <router-link to="/login" class="text-emerald-600 hover:underline"
            >Faça login aqui</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import InputForms from '../../components/forms/InputForms.vue'
import { Role } from './types/roles'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './store/auth'

interface RegisterForm {
  name: string
  email: string
  password: string
  roles: Role
}

const form = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  roles: Role.PUBLIC,
})

const roleOptions = [
  { label: 'Público', value: Role.PUBLIC },
  { label: 'Criador', value: Role.CREATOR },
]

const errorMessage = ref('')

const redirectPath = computed(() => (route.query.redirect as string | undefined) ?? '/')

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleRegister = async () => {
  errorMessage.value = ''
  try {
    await auth.registerWithEmailPassword({
      email: form.email.trim(),
      password: form.password.trim(),
      name: form.name.trim(),
      roles: [form.roles],
    })

    await router.push(redirectPath.value)
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Não foi possível entrar. Verifique e-mail e senha.'
  }
}
</script>
