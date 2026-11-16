import test from 'node:test';
import assert from 'node:assert/strict';
import { todayText, weekText } from '../tgcloud/lib/schedule.js';
import { handleMessage } from '../tgcloud/lib/bot.js';

const expected = [
  'Понеділок — хз', 'Вівторок — вдома', 'Середа — на роботі',
  'Четвер — вдома', 'П’ятниця — на роботі', 'Субота — вдома', 'Неділя — вихідний',
];
for (let i = 0; i < 7; i++) {
  test(expected[i], () => {
    assert.equal(todayText(new Date(Date.UTC(2026, 10, 16 + i, 12))), expected[i]);
  });
}
test('Kyiv midnight before UTC midnight in winter and summer', () => {
  assert.equal(todayText(new Date('2026-11-16T21:59:59Z')), expected[0]);
  assert.equal(todayText(new Date('2026-11-16T22:00:00Z')), expected[1]);
  assert.equal(todayText(new Date('2026-07-06T20:59:59Z')), expected[0]);
  assert.equal(todayText(new Date('2026-07-06T21:00:00Z')), expected[1]);
});
test('Kyiv daylight saving transitions', () => {
  for (const date of ['2026-03-29T00:59:59Z', '2026-03-29T01:00:00Z',
    '2026-10-25T00:59:59Z', '2026-10-25T01:00:00Z']) {
    assert.equal(todayText(new Date(date)), expected[6]);
  }
  assert.equal(todayText(new Date('2026-03-29T21:00:00Z')), expected[0]);
  assert.equal(todayText(new Date('2026-10-25T21:59:59Z')), expected[6]);
  assert.equal(todayText(new Date('2026-10-25T22:00:00Z')), expected[0]);
});
test('week preserves the user schedule', () => assert.equal(weekText(), expected.join('\n')));

async function replies(text, extra = {}) {
  const calls = [];
  await handleMessage({ sendMessage: async (payload) => calls.push(payload) },
    { chat: { id: 123, type: 'private' }, text, ...extra }, new Date('2026-11-18T12:00:00Z'));
  return calls;
}
for (const command of ['/today', '/today@eagle_bot', ' 📅 Сьогодні ', '/TODAY']) {
  test(`today: ${command}`, async () => {
    const [reply] = await replies(command);
    assert.equal(reply.chat_id, 123);
    assert.equal(reply.text, 'Середа — на роботі');
    assert.equal(reply.reply_markup.keyboard[0][0].text, '📅 Сьогодні');
  });
}
test('start with deep link includes today and help', async () => {
  const [reply] = await replies('/start hello');
  assert.match(reply.text, /^Середа — на роботі\n/);
  assert.match(reply.text, /\/today/);
});
test('week command and button', async () => {
  for (const command of ['/week', '🗓 Розклад']) {
    assert.equal((await replies(command))[0].text, expected.join('\n'));
  }
});
test('unknown messages and help', async () => {
  for (const command of ['/help', '/unknown', 'привіт', '/todayno']) {
    assert.match((await replies(command))[0].text, /\/today — сьогодні/);
  }
});
test('ignores non-text and group messages', async () => {
  assert.deepEqual(await replies(undefined), []);
  assert.deepEqual(await replies('/today', { chat: { id: -1, type: 'group' } }), []);
});
test('API errors propagate to platform', async () => {
  await assert.rejects(handleMessage({ sendMessage: async () => { throw new Error('API unavailable'); } },
    { chat: { id: 123, type: 'private' }, text: '/today' }), /API unavailable/);
});
