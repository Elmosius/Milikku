export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'Terjadi kesalahan yang tidak diketahui.';

  const message = error?.message?.toLowerCase() || '';

  // --- Auth Errors ---
  if (message.includes('invalid login credentials')) {
    return 'Email atau password yang kamu masukkan salah.';
  }
  if (message.includes('user already registered')) {
    return 'Email ini sudah terdaftar. Silakan login.';
  }
  if (message.includes('email not confirmed')) {
    return 'Email kamu belum dikonfirmasi. Cek inbox kamu.';
  }
  if (message.includes('password should be at least')) {
    return 'Password terlalu pendek. Gunakan minimal 6 karakter.';
  }

  // --- General & Database Errors ---
  if (message.includes('fetch') || message.includes('network')) {
    return 'Koneksi jaringan bermasalah. Cek koneksi internetmu.';
  }
  if (message.includes('row-level security') || message.includes('rls')) {
    return 'Kamu tidak memiliki akses untuk melakukan tindakan ini.';
  }

  return 'Gagal memproses permintaanmu. Silakan coba beberapa saat lagi.';
}

export function handleActionError(error: any) {
  return getFriendlyErrorMessage(error);
}
