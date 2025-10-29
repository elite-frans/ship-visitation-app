<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import {useRouter} from 'vue-router';
import {useLayout} from '@/layout/composables/layout';
import {useAuthStore} from '@/stores/auth';
import logoUrl from '@/assets/images/logo.png'

const {toggleMenu, toggleDarkMode, isDarkTheme} = useLayout();
const router = useRouter();
const auth = useAuthStore();
const menuOpen = ref(false);
const userBtnRef = ref(null);
const userMenuRef = ref(null);

onMounted(async () => {
  if (!auth.user) {
    try {
      await auth.fetchUser();
    } catch (_) {
    }
  }

  const onDocClick = (e) => {
    const btn = userBtnRef.value;
    const menu = userMenuRef.value;
    if (!btn || !menu) return;
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menuOpen.value = false;
    }
  };
  document.addEventListener('pointerdown', onDocClick);
  // store for cleanup
  (window)._appTopbarDocClick = onDocClick;
});

onBeforeUnmount(() => {
  const handler = (window)._appTopbarDocClick;
  if (handler) document.removeEventListener('pointerdown', handler);
});

const toggleUserMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const logout = async () => {
  await auth.logout();
  router.replace({name: 'login'});
};
</script>

<template>
  <div class="layout-topbar shadow-sm">
    <div class="layout-topbar-logo-container py-2">
      <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
        <i class="pi pi-bars"></i>
      </button>
      <router-link to="/" class="layout-topbar-logo">
        <img :src="logoUrl" alt="K Line Roro Bulk Ship Management"
             width="64" height="64" srcset="">
        <span>KRBS</span>
      </router-link>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
          <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
        </button>
      </div>

      <div class="relative">
        <button ref="userBtnRef" type="button" class="layout-topbar-action flex items-center" @click="toggleUserMenu">
          <i class="pi pi-user"></i>
        </button>
        <div ref="userMenuRef" v-if="menuOpen"
             class="absolute right-0 mt-2 w-56 bg-surface-0 dark:bg-surface-900 shadow-sm rounded-lg border border-surface-200 dark:border-surface-800 py-2 z-50">
          <div class="px-4 py-1 font-medium uppercase text-surface-700 dark:text-surface-200">
            {{ auth.user?.name || 'Account' }}
          </div>
          <div class="border-t my-2"></div>
          <button class="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-800"
                  @click="router.push('/')">
            <i class="pi pi-home mr-2"/> Home
          </button>
          <button class="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-800"
                  @click="router.push('/profile')">
            <i class="pi pi-id-card mr-2"/> Profile
          </button>
          <div class="border-t my-2"></div>
          <button class="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-800" @click="logout">
            <i class="pi pi-sign-out mr-2"/> Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
