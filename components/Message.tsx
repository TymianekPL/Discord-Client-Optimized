import { MessageInfo } from "../src/Discord/datatypes";
import styles from "./Message.module.css";

export default function Message({ message }: {
     message: MessageInfo;
}) {
     return (
          <div id={`msg-d-${message.id}`} className={styles.message}>
               <div className={styles.message_container}>
               <div className={styles.header}>
                    <span className={styles.message_username}>
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
               </div>
               
          </div>
     );
}