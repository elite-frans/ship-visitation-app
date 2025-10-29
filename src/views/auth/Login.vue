<script setup>
import FloatingConfigurator from "@/components/FloatingConfigurator.vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import logoUrl from "@/assets/images/logo.png";

const email = ref("");
const password = ref("");
const remember = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const submit = async () => {
  loading.value = true;
  errorMessage.value = "";
  try {
    await auth.login({
      email: email.value,
      password: password.value,
      remember: remember.value,
    });
    const redirect = route.query.redirect || "/";
    await router.replace(redirect);
  } catch (err) {
    errorMessage.value = err?.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <FloatingConfigurator />
  <div
    class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen overflow-hidden"
  >
    <div class="flex flex-col items-center justify-center px-0">
      <div
        class="bg-surface-0 dark:bg-surface-900 shadow-2xl rounded-xl w-full sm:w-[480px] lg:w-[480px] xl:w-[520px]"
      >
        <div class="bg-surface-0 dark:bg-surface-900 shadow-2xl rounded-xl">
          <div class="py-20 px-8 sm:px-10">
            <div class="flex flex-col items-center justify-center mb-3">
              <Image
                :src="logoUrl"
                alt="K Line Roro Bulk Ship Management Co., LTD"
                srcset=""
                width="64"
                height="64"
              />
            </div>
            <div class="text-center mb-8 space-y-3">
              <div
                class="text-surface-900 dark:text-surface-0 text-3xl font-bold"
              >
                Welcome to Ship Visitation
              </div>
              <p class="text-muted-color font-medium"
                >Sign in to continue</p
              >
            </div>

            <div>
              <label
                for="email1"
                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2"
                >Email</label
              >
              <InputText
                id="email1"
                type="email"
                placeholder="you@example.com"
                class="mb-8"
                fluid
                v-model="email"
              />

              <label
                for="password1"
                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2"
                >Password</label
              >
              <Password
                id="password1"
                v-model="password"
                placeholder="Password"
                :toggleMask="true"
                class="mb-4"
                fluid
                :feedback="false"
              ></Password>

              <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                <div class="flex items-center">
                  <Checkbox
                    v-model="remember"
                    id="rememberme1"
                    binary
                    class="mr-2"
                  ></Checkbox>
                  <label for="rememberme1">Remember me</label>
                </div>
                <span
                  class="font-medium no-underline ml-2 text-right cursor-pointer text-primary"
                  >Forgot password?</span
                >
              </div>
              <div v-if="errorMessage" class="text-red-500 mb-3">
                {{ errorMessage }}
              </div>
              <Button
                :label="loading ? 'Signing in...' : 'Sign In'"
                class="w-full"
                :loading="loading"
                @click="submit"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
#pjmtmLogo * {
  border-top-left-radius: 53px !important;
  border-top-right-radius: 53px !important;
}
</style>
