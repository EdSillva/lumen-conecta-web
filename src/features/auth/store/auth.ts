import { defineStore } from 'pinia'
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  browserLocalPersistence,
  setPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../../../lib/firebase'
import { Role, type SessionUser } from '../types/roles'
import { api } from '../../../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as SessionUser | null,
    loading: false,
    ready: false,
    _readyPromise: null as Promise<void> | null,
    _resolveReady: null as null | (() => void),
    _unsub: null as null | (() => void),
  }),
  getters: {
    isAuthenticated(state) {
      return Boolean(state.user)
    },
    isCreator(state) {
      return Boolean(state.user?.roles.includes(Role.CREATOR))
    },
    isAdmin(state) {
      return Boolean(state.user?.roles.includes(Role.ADMIN))
    },
  },

  actions: {
    init() {
      if (this._readyPromise) return this._readyPromise

      this._readyPromise = new Promise<void>((resolve) => {
        this._resolveReady = () => {
          this.ready = true
          resolve()
        }
      })

      // Ensure browser persistence explicitly so a dev server reload keeps the Firebase session intact.
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.error('[auth] setPersistence failed', err)
        // Do not block app if persistence fails (Safari/Private mode scenarios).
        this._resolveReady?.()
      })

      // Subscribe once to stay in sync with token refreshes and sign-outs.
      this._unsub = onIdTokenChanged(auth, (user) => {
        if (!user) {
          this.user = null
          this._resolveReady?.()
          return
        }

        void (async () => {
          try {
            const { roles } = await api.get<{ roles: Role[] }>('/auth/me')

            const token = await user.getIdToken()

            this.user = {
              id: user.uid,
              name: user.displayName ?? user.email ?? 'Usuário',
              roles,
              token,
            }
          } catch (err) {
            console.error('[auth] init error', err)
          } finally {
            this._resolveReady?.()
          }
        })()
      })

      return this._readyPromise
    },

    ensureReady() {
      return this.init()
    },

    async loginWithToken(token: string) {
      this.loading = true
      try {
        await signInWithCustomToken(auth, token)
      } finally {
        this.loading = false
      }
    },

    async registerWithEmailPassword(payload: {
      email: string
      password: string
      name?: string
      roles?: Role[]
    }) {
      this.loading = true
      const { email, password, name, roles } = payload
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password)

        await api.post('/auth/register', {
          roles: roles ?? [Role.PUBLIC],
        })

        const me = await api.get<{ roles: Role[] }>('/auth/me')

        this.user = {
          id: result.user.uid,
          name: name ?? result.user.email ?? 'Usuário',
          roles: me.roles,
          token: await result.user.getIdToken(),
        }
      } finally {
        this.loading = false
      }
    },

    async recoveryPassword(email: string) {
      this.loading = true
      try {
        await sendPasswordResetEmail(auth, email)
      } finally {
        this.loading = false
      }
    },

    async loginWithEmailPassword(email: string, password: string) {
      this.loading = true
      try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        // Force-refresh token to ensure latest custom claims (roles)
        const idTokenResult = await result.user.getIdTokenResult(true)

        const roles = (idTokenResult.claims.roles as Role[] | undefined) ?? []
        console.log('[auth] login roles', { uid: result.user.uid, roles })

        this.user = {
          id: result.user.uid,
          name: result.user.displayName ?? result.user.email ?? 'Usuário',
          roles,
          token: idTokenResult.token,
        } satisfies SessionUser
      } finally {
        this.loading = false
      }
    },

    setUser(user: SessionUser | null) {
      this.user = user
    },

    async logout() {
      await signOut(auth)
      this.user = null
    },
  },
})
