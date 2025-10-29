import { ref, onMounted } from "vue";

export function useDataTableHandler(store, fetchMethodName, type = null, filters = null) {
  const search = ref("");

  // Handle pagination
  const onPage = async (e) => {
    const next = (e.page ?? 0) + 1;
    store.page = next;

    await store[fetchMethodName](next, search.value, null, type, filters);
  };

  // Handle search
  const onSearch = async (term) => {
    search.value = term;
    store.page = 1;

    await store[fetchMethodName](1, term, null, type, filters);
  };

  // Initial fetch
  onMounted(() => {
    store.isWithTrash = false;
    store.page = 1;
    store[fetchMethodName](1, search.value, null, type, filters);
  });

  return {
    search,
    onPage,
    onSearch,
  };
}
