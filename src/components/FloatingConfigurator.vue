<script setup>
import { useLayout } from '@/layout/composables/layout';

const { toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="fixed gap-4 top-20 right-8 hidden lg:block" style="z-index: 1">
        <Button type="button"
                @click="toggleDarkMode"
                rounded raised
                :icon="isDarkTheme ? 'pi pi-moon' : 'pi pi-sun'"
                severity="secondary"
        />
    </div>
</template>
