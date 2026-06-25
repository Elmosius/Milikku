export type ReminderType = 'warranty' | 'lending';

export type ReminderStage =
  | 'warranty-30'
  | 'warranty-7'
  | 'warranty-1'
  | 'warranty-expired'
  | 'lending-3'
  | 'lending-today'
  | 'lending-overdue';

export type ReminderSeverity = 'info' | 'warning' | 'critical';

export interface Reminder {
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
  readAt: string | null;
  dismissedAt: string | null;
  isRead: boolean;
  isDismissed: boolean;
}

export interface ReminderCounts {
  active: number;
  unread: number;
  dismissed: number;
}

export interface ReminderResponse {
  reminders: Reminder[];
  counts: ReminderCounts;
}

export type ReminderStatus = 'all' | 'active' | 'unread' | 'dismissed';
export type ReminderAction = 'read' | 'unread' | 'dismiss';
