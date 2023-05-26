import { Player } from "discord-player";
import { Collection } from "discord.js";

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
        buttons: Collection<string, any>;
        player: Player;
    }
}
