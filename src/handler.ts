import 'colors';
import 'ffmpeg';

import * as fs from 'fs';
import { Client, Collection } from 'discord.js';
import { YouTubeExtractor } from '@discord-player/extractor';
import { Player } from 'discord-player';

import { checkCommandModule, checkProperties } from './events/validData';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>;
    buttons: Collection<string, any>;
    player: Player;
  }
}

async function loadCommands(client: Client, commandsDirectory: string) {
  const commandFolders = await getFolders(commandsDirectory);

  for (const folder of commandFolders) {
    const commandFiles = await getFiles(`${commandsDirectory}${folder}/`);

    for (const file of commandFiles) {
      const commandName = getCommandName(file);
      const { default: commandModule } = await import(`./handler/commands/${folder}/${file}`);

      if (checkCommandModule(commandName, commandModule) && checkProperties(commandName, commandModule)) {
        client.commands.set(commandModule.name, commandModule);
        console.log(`Loaded command [${commandName}]`.green);
      }
    }
  }
}

async function loadButtons(client: Client, buttonsDirectory: string) {
  const buttonFolders = await getFolders(buttonsDirectory);

  for (const folder of buttonFolders) {
    const buttonFiles = await getFiles(`${buttonsDirectory}${folder}/`);

    for (const file of buttonFiles) {
      const buttonName = file.split('.')[0];
      const { default: buttonModule } = await import(`./handler/buttons/${folder}/${file}`);

      if (checkCommandModule(buttonName, buttonModule) && checkProperties(buttonName, buttonModule)) {
        client.buttons.set(buttonModule.name, buttonModule);
        console.log(`Loaded button [${buttonName}]`.green);
      }
    }
  }
}

async function loadEvents(client: Client, clientDirectory: string) {
  const eventFolders = await getFolders(clientDirectory);

  for (const folder of eventFolders) {
    const eventFiles = await getFiles(`${clientDirectory}${folder}/`);
    const eventName = folder;

    for (const file of eventFiles) {
      const { default: event } = await import(`./handler/client/${folder}/${file}`);

      client.on(eventName, event.bind(null, client));
      console.log(`Loaded event [${eventName}]`.green);
    }
  }
}

async function getFolders(directory: string): Promise<string[]> {
  try {
    const folders = await fs.promises.readdir(directory);
    return folders.filter(folder => folder !== null);
  } catch (err) {
    console.error(`Error reading directory: ${directory}`, err);
    return [];
  }
}

async function getFiles(directory: string): Promise<string[]> {
  try {
    return await fs.promises.readdir(directory);
  } catch (err) {
    console.error(`Error reading directory: ${directory}`, err);
    return [];
  }
}

function getCommandName(file: string): string {
  return file.split('.')[0];
}

function setUpPlayer(client: Client) {
  client.player = new Player(client, {
    ytdlOptions: {
      quality: 'highest',
    },
  });

  client.player.extractors.register(YouTubeExtractor, undefined);
}

function executeEvents(client: Client): void {
  client.commands = new Collection();
  client.buttons = new Collection();

  const commandsDirectory = __dirname + '/handler/commands/';
  const buttonsDirectory = __dirname + '/handler/buttons/';
  const clientDirectory = __dirname + '/handler/client/';

  loadCommands(client, commandsDirectory)
    .then(() => loadButtons(client, buttonsDirectory))
    .then(() => loadEvents(client, clientDirectory))
    .then(() => {
      setUpPlayer(client);
      console.log('Client events executed successfully.'.green.underline);
    })
    .catch(error => {
      console.error('Error executing client events:', error);
    });
}

export default executeEvents;