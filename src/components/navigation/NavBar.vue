<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li v-for="item in visibleNavItems" :key="item.label">
            <template v-if="item.children?.length">
              <details>
                <summary>{{ item.label }}</summary>
                <ul class="bg-base-100 z-1 w-40 p-2">
                  <li v-for="child in item.children" :key="child.label">
                    <button class="hover:text-slate-400" type="button" @click="child.action()">
                      {{ child.label }}
                    </button>
                  </li>
                </ul>
              </details>
            </template>
            <template v-else>
              <button class="hover:text-slate-400" type="button" @click="item.action?.()">
                {{ item.label }}
              </button>
            </template>
          </li>
        </ul>
      </div>
      <button class="pr-2 text-start text-sm font-semibold md:text-lg" type="button" @click="goHome">
        Lumen Conecta
      </button>
      <span class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
        >beta</span
      >
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li v-for="item in visibleNavItems" :key="item.label">
          <template v-if="item.children?.length">
            <details>
              <summary>{{ item.label }}</summary>
              <ul class="bg-base-100 z-1 w-40 p-2">
                <li v-for="child in item.children" :key="child.label">
                  <button class="hover:text-slate-400" type="button" @click="child.action()">
                    {{ child.label }}
                  </button>
                </li>
              </ul>
            </details>
          </template>
          <template v-else>
            <button class="hover:text-slate-400" type="button" @click="item.action?.()">
              {{ item.label }}
            </button>
          </template>
        </li>
      </ul>
    </div>
    <!-- Profile navbar section -->
    <div class="navbar-end gap-3">
      <span v-if="auth.user" class="hidden text-slate-700 md:block">{{ auth.user.name }}</span>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a class="hover:bg-secondary justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a class="hover:bg-secondary">Settings</a></li>
          <li>
            <a v-if="auth.user" class="hover:bg-secondary" @click="logoutAndGo"> Logout </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../features/auth/store/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

type NavAction = () => Promise<void>
type NavChild = { label: string; action: NavAction; show?: boolean }
type NavItem = { label: string; action?: NavAction; children?: NavChild[]; show?: boolean }

const navItems = computed<NavItem[]>(() => [
  {
    label: 'Inicio',
    action: goHome,
  },
  {
    label: 'Eventos',
    children: [
      {
        label: 'Criar evento',
        action: goCreate,
        show: auth.isCreator,
      },
      {
        label: 'Ver eventos',
        action: goEvents,
      },
    ],
  },
  {
    label: 'Backoffice',
    action: goBackoffice,
    show: auth.isAdmin,
  },
])

const visibleNavItems = computed(() =>
  navItems.value
    .filter((item) => item.show !== false)
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => child.show !== false),
    })),
)

async function logoutAndGo() {
  await auth.logout()
  await router.push({ name: 'login' })
}

async function goHome() {
  await router.push({ name: 'home' })
}

async function goEvents() {
  await router.push({ name: 'events' })
}

async function goCreate() {
  await router.push({ name: 'creator-event-new' })
}

async function goBackoffice() {
  await router.push({ name: 'backoffice' })
}
</script>
