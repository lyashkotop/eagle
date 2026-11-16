# Eagle — бот із розкладом

Бот для **Telegram Serverless**: відповідає на команди у приватному чаті.
День визначається за `Europe/Kyiv`, з урахуванням літнього часу.

| День | Відповідь |
| --- | --- |
| Понеділок | хз |
| Вівторок | вдома |
| Середа | на роботі |
| Четвер | вдома |
| П’ятниця | на роботі |
| Субота | вдома |
| Неділя | вихідний |

`/start` — сьогоднішній розклад і кнопки. `/today` — сьогодні.
`/week` — весь тиждень. `/help` — підказка.
Також є кнопки «📅 Сьогодні» та «🗓 Розклад».
Повідомлення самостійно не надсилає. У групах не відповідає.

## Запуск на Telegram Serverless

Потрібні Node.js 18+ і доступ до розділу **Serverless** свого бота в
[@BotFather](https://t.me/BotFather).

1. Створи бота через `/newbot`, якщо ще не створив.
2. У BotFather відкрий свого бота → **Serverless**, увімкни його.
3. У **Serverless → CLI Access → Access token** отримай CLI-токен.
   Це окремий токен формату `app<id>:<secret>`, а не Bot API token.
4. У терміналі:

   ```sh
   git clone https://github.com/lyashkotop/eagle.git
   cd eagle
   npm ci
   npx tgcloud login
   npm run deploy
   ```

   Встав CLI-токен у запит `login`. Він залишається локально в ігнорованій
   папці `.tgcloud/`; не додавай його в код чи GitHub.
5. Відкрий бота в Telegram і надішли `/start`, потім `/today` та `/week`.

Serverless сам налаштовує webhook. База даних для цього бота не потрібна;
`migrate` запускати не потрібно.
Якщо пункту Serverless немає, потрібен доступ до функції з боку Telegram.

За бажанням у BotFather задай меню команд:

```text
today - Розклад на сьогодні
week - Розклад на тиждень
help - Допомога
```

## Перевірка і зміни

```sh
npm test
npm run status
```

Розклад: `tgcloud/lib/schedule.js`. Обробка повідомлень: `tgcloud/lib/bot.js`.
Точка входу: `tgcloud/handlers/message.js`.
Після редагування запусти `npm test`, потім `npm run deploy`.

Тести перевіряють усі дні, київську північ узимку та влітку,
перехід на літній/зимовий час, команди й кнопки з підставленим Bot API.
Перевірка в реальному середовищі після `login`:

```sh
npx tgcloud run handlers/message '{chat:{id:YOUR_CHAT_ID,type:"private"},text:"/today"}'
```

Заміни `YOUR_CHAT_ID` на числовий ID свого чату. Команда справді надішле
повідомлення через Bot API; бот повинен мати відкритий із тобою чат.

[Документація Telegram Serverless](https://blogfork.telegram.org/bots/serverless).
