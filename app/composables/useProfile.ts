import { ref } from 'vue';
import { toast } from 'vue-sonner';

export interface Profile {
  id: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function useProfile() {
  const {
    data: profile,
    pending,
    refresh,
  } = useFetch<Profile>('/api/profile', {
    default: () => ({ id: '' }),
  });

  const isUpdating = ref(false);
  const isUploading = ref(false);

  const updateProfile = async (values: { fullName?: string; avatarUrl?: string }) => {
    isUpdating.value = true;
    try {
      await $fetch<Profile>('/api/profile', {
        method: 'PUT',
        body: values,
      });
      await refresh();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'Failed to update profile');
      throw error;
    } finally {
      isUpdating.value = false;
    }
  };

  const uploadAvatar = async (file: File) => {
    isUploading.value = true;
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await $fetch<{ avatarUrl: string }>('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      await updateProfile({ avatarUrl: response.avatarUrl });
      toast.success('Avatar uploaded successfully');
      return response.avatarUrl;
    } catch (error: any) {
      toast.error(error.data?.statusMessage || error.message || 'Failed to upload avatar');
      throw error;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    profile,
    pending,
    refresh,
    isUpdating,
    isUploading,
    updateProfile,
    uploadAvatar,
  };
}
