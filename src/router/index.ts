import { createRouter, createWebHistory } from 'vue-router'

import { Role } from '../features/auth/types/roles'
import { useAuthStore } from '../features/auth/store/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: () => import('../features/home/HomePage.vue'),
    },

    // Auth routes
    {
      path: '/login',
      name: 'login',
      component: () => import('../features/auth/LoginPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../features/auth/RegisterPage.vue'),
    },
    {
      path: '/recovery-password',
      name: 'recovery-password',
      component: () => import('../features/auth/RecoveryPassword.vue'),
    },

    // Public routes
    {
      path: '/events',
      name: 'events',
      meta: { requiresAuth: true },
      component: () => import('../features/public/EventsPage.vue'),
    },
    {
      path: '/events/:id',
      name: 'event-detail',
      meta: { requiresAuth: true },
      component: () => import('../features/public/EventDetailPage.vue'),
    },

    // Creator routes
    {
      path: '/creator/events/new',
      name: 'creator-event-new',
      meta: { requiresAuth: true, roles: [Role.CREATOR, Role.ADMIN, Role.SUDO] },
      component: () => import('../features/creator/EventFormPage.vue'),
    },
    {
      path: '/creator/events/:id/edit',
      name: 'creator-event-edit',
      meta: { requiresAuth: true, roles: [Role.CREATOR, Role.ADMIN, Role.SUDO] },
      component: () => import('../features/creator/EventFormPage.vue'),
    },

    // Admin routes
    {
      path: '/backoffice',
      name: 'backoffice',
      meta: { requiresAuth: true, roles: [Role.ADMIN, Role.SUDO] },
      component: () => import('../features/backoffice/AdminDashboard.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.ensureReady()
  const requiresAuth = Boolean(to.meta.requiresAuth)
  const allowedRoles = (to.meta.roles as Role[] | undefined) ?? []

  if (to.name === 'login' && auth.user) {
    return { name: 'events' }
  }

  if (!requiresAuth) {
    return true
  }

  if (!auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (allowedRoles.length === 0) {
    return true
  }

  const hasRole = allowedRoles.some((role) => auth.user?.roles.includes(role))
  if (!hasRole) {
    return { name: 'events' }
  }

  return true
})

export default router
