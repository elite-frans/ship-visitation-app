import { defineStore } from 'pinia';
import { api } from '@/service/http';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth.token') || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user) || Boolean(state.token),
  },
  actions: {
    async fetchUser() {
      try {
        const { data } = await api.get('/api/spa/me', { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        this.user = data;
        return data;
      } catch (err) {
        this.user = null;
        throw err;
      }
    },
    async login({ email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const strategy = import.meta.env.VITE_AUTH_STRATEGY || 'token'; // 'cookie' or 'token'

        // Prepare credentials compatible with username or email backends
        const credentials = /@/.test(email)
          ? { email, password }
          : { username: email, password };

        const { data } = await api.post('/api/spa/login', credentials);
        const token = data?.access_token || data?.token;
        if (token) {
          this.token = token;
          localStorage.setItem('auth.token', token);
          await this.fetchUser().catch(() => {});
        }
        return data;
      } catch (err) {
        this.error = err?.response?.data || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await api.post('/api/spa/logout');
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // ignore
      }
      this.user = null;
      this.token = null;
      localStorage.removeItem('auth.token');
    }
  }
});


