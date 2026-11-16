import { api } from 'sdk';
import { handleMessage } from '../lib/bot.js';

export default async function (message) {
  await handleMessage(api, message);
}
