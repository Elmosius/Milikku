export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'Rp 0';

  const num =
    typeof value === 'string' ? parseFloat(value.toString().replace(/[^0-9.-]+/g, '')) : value;
  if (isNaN(num)) return 'Rp 0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function unformatCurrency(value: string): number {
  if (!value) return 0;
  const numStr = value.replace(/[^0-9]/g, '');
  const num = parseInt(numStr, 10);
  return isNaN(num) ? 0 : num;
}
