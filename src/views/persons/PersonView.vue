<script setup>
import { usePersonStore } from "@/stores/personStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const personStore = usePersonStore();
const { personDetails } = storeToRefs(personStore);

const goBack = () => {
  router.push({ name: "Persons" });
};

onMounted(() => {
  const id = route.params.id;
  personStore.viewPerson(id);
});
</script>

<template>
  <div class="w-full h-full">
    <div class="card">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">Person Details</h1>
        <Button
          label="Back"
          size="small"
          severity="secondary"
          variant="text"
          icon="pi pi-arrow-left"
          @click="goBack"
        />
      </div>
      <divider />
      <div class="space-y-9">
        <div class="space-y-7">
          <div class="space-y-3">
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">First name:</h1>
              <p>{{ personDetails?.first_name }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Last name:</h1>
              <p>{{ personDetails.last_name }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Rank:</h1>
              <p>{{ personDetails?.rank }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Company:</h1>
              <p>{{ personDetails?.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
