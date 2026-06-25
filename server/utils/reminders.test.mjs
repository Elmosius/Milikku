import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReminders } from './reminders.ts';

const item = (warrantyExpiry) => [{ id: 'item-1', name: 'Laptop', warrantyExpiry }];
const lending = (expectedReturnAt) => [
  {
    id: 'lending-1',
    borrowerName: 'Budi',
    expectedReturnAt,
    returnedAt: null,
    itemName: 'Kamera',
  },
];

test('uses the expected warranty thresholds', () => {
  assert.equal(
    buildReminders({ items: item('2026-07-25'), lendings: [], today: '2026-06-25' })[0]?.stage,
    'warranty-30',
  );
  assert.equal(
    buildReminders({ items: item('2026-07-02'), lendings: [], today: '2026-06-25' })[0]?.stage,
    'warranty-7',
  );
  assert.equal(
    buildReminders({ items: item('2026-06-26'), lendings: [], today: '2026-06-25' })[0]?.stage,
    'warranty-1',
  );
  assert.equal(
    buildReminders({ items: item('2026-06-24'), lendings: [], today: '2026-06-25' })[0]?.stage,
    'warranty-expired',
  );
});

test('uses the expected lending thresholds', () => {
  assert.equal(
    buildReminders({ items: [], lendings: lending('2026-06-28'), today: '2026-06-25' })[0]?.stage,
    'lending-3',
  );
  assert.equal(
    buildReminders({ items: [], lendings: lending('2026-06-25'), today: '2026-06-25' })[0]?.stage,
    'lending-today',
  );
  assert.equal(
    buildReminders({ items: [], lendings: lending('2026-06-24'), today: '2026-06-25' })[0]?.stage,
    'lending-overdue',
  );
});

test('dismissal only applies to the matching stage key', () => {
  const state = {
    reminderKey: 'warranty:item-1:warranty-30',
    readAt: '2026-06-25T00:00:00.000Z',
    dismissedAt: '2026-06-25T00:00:00.000Z',
  };
  const dismissed = buildReminders({
    items: item('2026-07-25'),
    lendings: [],
    today: '2026-06-25',
    states: [state],
  });
  assert.equal(dismissed[0]?.isDismissed, true);

  const nextStage = buildReminders({
    items: item('2026-07-02'),
    lendings: [],
    today: '2026-06-25',
    states: [state],
  });
  assert.equal(nextStage[0]?.stage, 'warranty-7');
  assert.equal(nextStage[0]?.isDismissed, false);
});

test('returned lendings and far future dates do not create reminders', () => {
  const returned = lending('2026-06-24');
  returned[0].returnedAt = '2026-06-24';

  assert.equal(
    buildReminders({
      items: item('2026-08-01'),
      lendings: returned,
      today: '2026-06-25',
    }).length,
    0,
  );
});
