require('colors');

const { Collection } = require('discord.js');
const fs = require('fs');
const { checkCommandModule, checkProperties } = require('./events/validData');
const { Player } = require('discord-player');
const { YouTubeExtractor } = require("@discord-player/extractor");
const ffmpeg = require('ffmpeg');

module.exports = (client) => {

  client.commands = new Collection()
  client.buttons = new Collection()

  const commandsDirectory = './src/commands/';
  const clientDirectory = './src/client/';

  async function loadCommands(client) {
    const commandFolders = await getFolders(commandsDirectory);
    for (const folder of commandFolders) {
      const commandFiles = await getFiles(`${commandsDirectory}${folder}/`);
      for (const file of commandFiles) {
        const commandName = getCommandName(file);
        const commandModule = require(`./src/commands/${folder}/${file}`);
        if (checkCommandModule(commandName, commandModule) && checkProperties(commandName, commandModule)) {
          client.commands.set(commandModule.name, commandModule);
        }
        console.log(`Loaded command [${commandName}]`.green);
      }
    }
  }

  fs.readdir('./src/buttons/', (err, folders) => {
    if (err) return;
    if (!folders) return;
    folders.forEach(folder => {
      fs.readdir(`./src/buttons/${folder}`, (err, files) => {
        if (err) return console.log(err);
        files.forEach(file => {
          let cmdName = file.split('.')[0],
            cmdModule = require(`./src/buttons/${folder}/${file}`)
          if (checkCommandModule(cmdName, cmdModule)) {
            if (checkProperties(cmdName, cmdModule)) {
              //  console.log(cmdModule)
              client.buttons.set(cmdModule.name, cmdModule)
            }
          }
          console.log(`Loaded button [${cmdName}]`.green);
        })
      })
    })
  })

  async function loadEvents(client) {
    const eventFolders = await getFolders(clientDirectory);
    for (const folder of eventFolders) {
      const eventFiles = await getFiles(`${clientDirectory}${folder}/`);
      const eventName = folder;
      for (const file of eventFiles) {
        const event = require(`./src/client/${folder}/${file}`);
        client.on(eventName, event.bind(null, client));
        console.log(`Loaded event [${eventName}]`.green);
      }
    }
  }

  async function getFolders(directory) {
    try {
      const folders = await fs.promises.readdir(directory);
      return folders.filter(folder => folder !== null);
    } catch (err) {
      console.error(`Error reading directory: ${directory}`, err);
      return [];
    }
  }

  async function getFiles(directory) {
    try {
      return await fs.promises.readdir(directory);
    } catch (err) {
      console.error(`Error reading directory: ${directory}`, err);
      return [];
    }
  }

  function getCommandName(file) {
    return file.split('.')[0];
  }

  loadCommands(client);
  loadEvents(client);


  function setUpPlayed() {
    client.player = new Player(client, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
      },
      ffmpeg: 'C:\\ffmpeg\\bin',
      ffmpegArgs: [
        "-ss", "00:00:00",
        "-t", "00:00:30",
        "-i", 'C:\\ffmpeg\\bin' // Specify the path to FFmpeg executable
      ]
    })
    client.player.extractors.register(YouTubeExtractor);
    // client.player.setFfmpegPath("C:\\Users\\sif\\Downloads\\ffmpeg-6.0");
    // console.log('client player has been successfuly set up'.green.underline)
  }
  setUpPlayed();


}