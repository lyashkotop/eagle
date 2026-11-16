import { todayText, weekText } from './schedule.js';

const keyboard = {
  keyboard: [[{ text: '📅 Сьогодні' }, { text: '🗓 Розклад' }]],
  resize_keyboard: true,
  is_persistent: true,
};

export async function handleMessage(api, message, now = new Date()) {
  // Personal schedule bot: ignore group updates and non-text messages.
  if (message?.chat?.type !== 'private' || typeof message.text !== 'string') return;
  const text = message.text.trim();
  const command = text.match(/^\/(start|today|week|help)(?:@[a-z0-9_]+)?(?:\s|$)/i)?.[1]?.toLowerCase();
  let reply;
  if (command === 'start') {
    reply = `${todayText(now)}\n\nНатисни «📅 Сьогодні» або надішли /today.\nУвесь розклад — /week.\nЧасовий пояс: Київ.`;
  } else if (command === 'today' || text === '📅 Сьогодні') {
    reply = todayText(now);
  } else if (command === 'week' || text === '🗓 Розклад') {
    reply = weekText();
  } else {
    reply = 'Твій розклад за київським часом:\n/today — сьогодні\n/week — увесь тиждень\n\nМожна також натиснути кнопку внизу.';
  }
  await api.sendMessage({ chat_id: message.chat.id, text: reply, reply_markup: keyboard });
}
