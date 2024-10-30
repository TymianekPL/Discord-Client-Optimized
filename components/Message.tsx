import { useEffect, useState } from "react";
import { MessageInfo } from "../src/Discord/datatypes";
import styles from "./Message.module.css";
import { Guild } from "../src/Discord";

export default function Message({ message, guild }: {
     message: MessageInfo;
     guild: Guild;
}) {
     const [roleColour, setRoleColour] = useState<string>();

     guild?.fetchMember(message.author!.id).then(member => {
          console.log(member);
     });
     

     return (
          <div id={`msg-d-${message.id}`} className={styles.message}>
               <div className={styles.message_container}>
                    <div className={styles.header}>
                         <span className={styles.message_username} style={{
                              color: roleColour
                         }}>
                              {message.author?.global_name ?? message.author?.username}
                         </span>
                         <span style={{opacity: "0.6"}}>
                              <span className={styles.dot}>{"\u2B24"}</span>

                              {new Date(message.timestamp as unknown as string).toLocaleString()}
                         </span>
                    </div>
                    <div className={styles.content}>
                         {message.content}
                    </div>
                    <div className={styles.attachments}>
                         {message.attachments.map(attachment => (
                              <div key={attachment.id}>
                                   <embed src={attachment.proxy_url} type={attachment.content_type} />
                              </div>
                         ))}
                    </div>
               </div>

          </div>
     );
}