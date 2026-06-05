import { computed, ref, watch } from 'vue';

export const useAuth = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  const isAuthenticated = computed(() => !!user.value);

  // Initialize loading as true if user is undefined (meaning it is still being fetched/initialized)
  const isLoading = ref(user.value === undefined);

  // Watch user state to update isLoading
  watch(
    user,
    (newUser) => {
      if (newUser !== undefined) {
        isLoading.value = false;
      }
    },
    { immediate: true },
  );

  const signOut = async () => {
    try {
      isLoading.value = true;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear user value manually and navigate to login
      user.value = null;
      await navigateTo('/auth/login');
    } catch (error) {
      isLoading.value = false;
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
  };
};
