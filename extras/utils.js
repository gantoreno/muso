const axios = require("axios");
const dedent = require("dedent");

const { TELEGRAM_BOT_TOKEN, AUDD_API_KEY, ONLINECONVERT_API_KEY } = process.env;

exports.extractFile = async (msg) => {
  const {
    voice: { file_id: fileId },
  } = msg;

  const {
    data: {
      result: { file_path: filePath },
    },
  } = await axios.get(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`
  );

  return filePath;
};

exports.startConversionJob = async (filePath) => {
  const {
    data: { id: jobId },
  } = await axios.post(
    "https://api2.online-convert.com/jobs",
    {
      input: [
        {
          type: "remote",
          source: `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`,
        },
      ],
      conversion: [
        {
          target: "mp3",
        },
      ],
    },
    {
      headers: {
        "x-oc-api-key": ONLINECONVERT_API_KEY,
      },
    }
  );

  return jobId;
};

exports.getConvertedFile = async (jobId) => {
  while (true) {
    const {
      data: { output },
    } = await axios.get(`https://api2.online-convert.com/jobs/${jobId}`, {
      headers: {
        "x-oc-api-key": ONLINECONVERT_API_KEY,
      },
    });

    if (output.length < 1) {
      continue;
    }

    const { uri: url } = output[0];

    return url;
  }
};

exports.indentifySong = async (url, bot) => {
  const { data } = await axios.post("https://api.audd.io/", {
    url,
    return: "timecode,apple_music,deezer,spotify",
    api_token: AUDD_API_KEY,
  });

  if (!(data.status === "success" && data.result)) {
    return null;
  }

  const { result: songData } = data;

  return songData;
};

exports.buildResponseMessage = async ({ songData, chatId }) => {
  const res = dedent`
    I found something! 🥳

    Title: ${songData.title}
    Artist: ${songData.artist}
    Album: ${songData.album}
    Release date: ${songData.release_date}
    ${
      songData.apple_music
        ? `\nListen on [Apple Music](${songData.apple_music.url})`
        : ``
    }
    ${
      songData.spotify
        ? `Listen on [Spotify](${songData.spotify.external_urls.spotify})`
        : ``
    }
    ${songData.deezer ? `Listen on [Deezer](${songData.deezer.link})` : ``}

    Published by ${songData.label}
  `;

  return res;
};
