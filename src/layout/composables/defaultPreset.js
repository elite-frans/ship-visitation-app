// You can change the name 'purple' to any name you like, in my case it was just to keep the standard
import {definePreset} from "@primevue/themes";
import Aura from "@primevue/themes/aura";

const blue = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a'
    },
    surface: {
      0: '#ffffff',
      50: '#f3f3f3',
      100: '#e7e7e8',
      200: '#cfd0d0',
      300: '#b7b8b9',
      400: '#9fa1a1',
      500: '#87898a',
      600: '#6e7173',
      700: '#565a5b',
      800: '#3e4244',
      900: '#262b2c',
      950: '#0e1315'
    },

    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}'
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}'
        }
      },
      dark: {
        primary: {
          color: '{primary.400}',
          contrastColor: '{surface.900}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}'
        },
        highlight: {
          background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
          focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)'
        }
      }
    }
  }
});

export default blue
