<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  label: {
    type: String,
    default: "Add Record",
  },
  routeName: {
    type: String,
    required: true,
  },
});

const onClickPage = () => {
  router.push({ name: props.routeName });
};
</script>

<template>
  <Button
    :label="label"
    icon="pi pi-plus"
    severity="success"
    size="small"
    @click="onClickPage"
  />
</template>
