import Discord from "../src/Discord/index";
import styles from "./ServerList.module.css";
import ServerIcon from "./ServerIcon";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GuildInfo } from "../src/Discord/datatypes";

export default function ServerList({ discord, setCurrentGuild }: {
     discord: Discord,
     setCurrentGuild: Dispatch<SetStateAction<GuildInfo | undefined>>;
}) {
     const [guilds, setGuilds] = useState<GuildInfo[]>();

     useEffect(() => {
          discord.fetchGuilds().then(r => setGuilds(r));
     }, []);

     console.log(guilds);
     return (
          <div className={styles.list}>
               {guilds?.map((guild) => {
                    return guild.icon != null
                         ? <ServerIcon file={(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=96`)} tooltip={guild.name} key={guild.id} setCurrentGuild={setCurrentGuild} id={guild} />
                         : <ServerIcon fallbackname={guild.name.split(" ").map(str => str[0]).join("")} tooltip={guild.name} key={guild.id} setCurrentGuild={setCurrentGuild} id={guild} />;
               })}
          </div>
     );
}
