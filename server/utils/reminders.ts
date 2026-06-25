import type {
  Reminder,
  ReminderSeverity,
  ReminderStage,
  ReminderType,
} from '~/types/reminder';

const JAKARTA_TIME_ZONE = 'Asia/Jakarta';
const MILLISECONDS_PER_DAY = 86_400_000;

interface WarrantySource {
  id: string;
  name: string;
  warrantyExpiry: string | null;
}

interface LendingSource {
  id: string;
  borrowerName: string;
  expectedReturnAt: string | null;
  returnedAt: string | null;
  itemName: string | null;
}

interface ReminderStateSource {
  reminderKey: string;
  readAt: Date | string | null;
  dismissedAt: Date | string | null;
}

interface ReminderCandidate {
  key: string;
  type: ReminderType;
  stage: ReminderStage;
  severity: ReminderSeverity;
  sourceId: string;
  title: string;
  message: string;
  dueDate: string;
  daysRemaining: number;
  href: string;
}

const formatJakartaDate = (date: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: JAKARTA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const parseDateOnly = (value: string) => {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export const differenceInCalendarDays = (targetDate: string, today: string) =>
  Math.round((parseDateOnly(targetDate) - parseDateOnly(today)) / MILLISECONDS_PER_DAY);

export const getJakartaToday = (now = new Date()) => formatJakartaDate(now);

const getWarrantyStage = (daysRemaining: number): ReminderStage | null => {
  if (daysRemaining < 0) return 'warranty-expired';
  if (daysRemaining <= 1) return 'warranty-1';
  if (daysRemaining <= 7) return 'warranty-7';
  if (daysRemaining <= 30) return 'warranty-30';
  return null;
};

const getLendingStage = (daysRemaining: number): ReminderStage | null => {
  if (daysRemaining < 0) return 'lending-overdue';
  if (daysRemaining === 0) return 'lending-today';
  if (daysRemaining <= 3) return 'lending-3';
  return null;
};

const pluralizeDays = (days: number) => `${days} hari`;

const buildWarrantyCandidate = (
  item: WarrantySource,
  today: string,
): ReminderCandidate | null => {
  if (!item.warrantyExpiry) return null;

  const daysRemaining = differenceInCalendarDays(item.warrantyExpiry, today);
  const stage = getWarrantyStage(daysRemaining);
  if (!stage) return null;

  const message =
    stage === 'warranty-expired'
      ? `Garansi telah berakhir ${pluralizeDays(Math.abs(daysRemaining))} yang lalu.`
      : daysRemaining === 0
        ? 'Garansi berakhir hari ini.'
        : `Garansi akan berakhir dalam ${pluralizeDays(daysRemaining)}.`;

  return {
    key: `warranty:${item.id}:${stage}`,
    type: 'warranty',
    stage,
    severity:
      stage === 'warranty-expired' ? 'critical' : stage === 'warranty-30' ? 'info' : 'warning',
    sourceId: item.id,
    title: `Garansi ${item.name}`,
    message,
    dueDate: item.warrantyExpiry,
    daysRemaining,
    href: `/items?item=${item.id}`,
  };
};

const buildLendingCandidate = (
  lending: LendingSource,
  today: string,
): ReminderCandidate | null => {
  if (!lending.expectedReturnAt || lending.returnedAt) return null;

  const daysRemaining = differenceInCalendarDays(lending.expectedReturnAt, today);
  const stage = getLendingStage(daysRemaining);
  if (!stage) return null;

  const itemName = lending.itemName || 'Barang';
  const message =
    stage === 'lending-overdue'
      ? `${itemName} terlambat dikembalikan ${pluralizeDays(Math.abs(daysRemaining))} oleh ${lending.borrowerName}.`
      : stage === 'lending-today'
        ? `${itemName} dijadwalkan kembali hari ini dari ${lending.borrowerName}.`
        : `${itemName} dijadwalkan kembali dalam ${pluralizeDays(daysRemaining)} dari ${lending.borrowerName}.`;

  return {
    key: `lending:${lending.id}:${stage}`,
    type: 'lending',
    stage,
    severity: stage === 'lending-overdue' ? 'critical' : 'warning',
    sourceId: lending.id,
    title: `Pengembalian ${itemName}`,
    message,
    dueDate: lending.expectedReturnAt,
    daysRemaining,
    href: `/lendings?lending=${lending.id}`,
  };
};

const severityRank: Record<ReminderSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

export const buildReminders = ({
  items,
  lendings,
  states = [],
  today = getJakartaToday(),
}: {
  items: WarrantySource[];
  lendings: LendingSource[];
  states?: ReminderStateSource[];
  today?: string;
}): Reminder[] => {
  const stateMap = new Map(states.map((state) => [state.reminderKey, state]));
  const candidates = [
    ...items.map((item) => buildWarrantyCandidate(item, today)),
    ...lendings.map((lending) => buildLendingCandidate(lending, today)),
  ].filter((candidate): candidate is ReminderCandidate => candidate !== null);

  return candidates
    .map((candidate) => {
      const state = stateMap.get(candidate.key);
      const readAt = state?.readAt ? new Date(state.readAt).toISOString() : null;
      const dismissedAt = state?.dismissedAt ? new Date(state.dismissedAt).toISOString() : null;

      return {
        ...candidate,
        readAt,
        dismissedAt,
        isRead: readAt !== null,
        isDismissed: dismissedAt !== null,
      };
    })
    .sort((a, b) => {
      const severityDifference = severityRank[a.severity] - severityRank[b.severity];
      if (severityDifference !== 0) return severityDifference;

      const dateDifference = a.dueDate.localeCompare(b.dueDate);
      if (dateDifference !== 0) return dateDifference;

      return a.title.localeCompare(b.title);
    });
};
