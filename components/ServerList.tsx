import Discord from "../src/Discord/index";
import styles from "./ServerList.module.css";
import ServerIcon from './ServerIcon';
import { useEffect, useState } from "react";
import { GuildInfo } from "../src/Discord/datatypes";

export default function ServerList({ discord }: {
     discord: Discord,
}) {
     const [guilds, setGuilds] = useState<GuildInfo[]>();

     useEffect(() => {
          discord.fetchGuilds().then(r => setGuilds(r));
     }, []);

     console.log(guilds);
     return (
          <div className={styles.list}>
               {guilds?.map((guild) => (
                    <ServerIcon file={(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=96`)} tooltip={guild.name} key={guild.id}/>
               ))}
          </div>
     );
}
