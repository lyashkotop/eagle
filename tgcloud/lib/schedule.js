export const schedule = [
  { key: 'Mon', day: 'Понеділок', text: 'хз' },
  { key: 'Tue', day: 'Вівторок', text: 'вдома' },
  { key: 'Wed', day: 'Середа', text: 'на роботі' },
  { key: 'Thu', day: 'Четвер', text: 'вдома' },
  { key: 'Fri', day: 'П’ятниця', text: 'на роботі' },
  { key: 'Sat', day: 'Субота', text: 'вдома' },
  { key: 'Sun', day: 'Неділя', text: 'вихідний' },
];

export function todayText(now = new Date()) {
  const key = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Kyiv', weekday: 'short',
  }).format(now);
  const entry = schedule.find((item) => item.key === key);
  return `${entry.day} — ${entry.text}`;
}

export function weekText() {
  return schedule.map(({ day, text }) => `${day} — ${text}`).join('\n');
}
