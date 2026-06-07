/**
 * Format an ISO date string to a localized Indonesian date.
 * Example: '2023-01-15' → '15 Januari 2023'
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
