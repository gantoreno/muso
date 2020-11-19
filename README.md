# Shagram Bot

A simple Telegram bot that listens music from voice messages, and identifyes the current playing song.

This bot is based on the [Node Telegram Bot API](https://github.com/yagop/node-telegram-bot-api) by [yagop](https://github.com/yagop), be sure to check them out!

## Documentation

To make your own version of this bot, you must have:

- A [Telegram bot](https://core.telegram.org/bots/api) API token.
- An [AudD](https://audd.io/) API key.
- An [Online-Convert](https://www.online-convert.com/) API key.

### Why so many API keys?

Telegram voice messages are stored in a `.oga` format for every chat. The audio recognition API (AudD) only works with `base64` encoded files.

For this bot to work, the voice message must be first transformed from `.oga` to `.mp3` through the Online-Convert API, in order for the AudD API to recognize it.

All of the API keys can be generated for free by just signing up into each service.

NOTE: The Online-Convert API allows only a certain ammount of conversions for the free plan. After some audios, the API will stop converting and will throw a 403 status code.

## Usage

To start working with this project, first clone the repo:

```sh
$ git clone https://github.com/hollandsgabe/hollands-sound-bot.git # Or fork the project
$ cd hollands-sound-bot
```

Install all the dependencies with `npm`

```sh
$ npm install
```

IMPORTANT: Before continuing with the project, make sure to rename the `.env.example` file to `.env`, and place all of your API keys into its corresponding place. Otherwise, your bot will not work!

After placing your API keys, you're ready to run your bot:

```sh
$ npm start # To run once
# Or
$ npm run dev # To watch for changes with nodemon
```

## License

This project is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT).
