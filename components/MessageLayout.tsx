import { Channel, Guild } from "../src/Discord";
import { MessageInfo } from "../src/Discord/datatypes";
import Message from "./Message";
import styles from "./MessageLayout.module.css";

export default function MessageLayout({ messages, currentChannel, currentGuild }: {
     messages: MessageInfo[],
     currentChannel: Channel;
     currentGuild: Guild;
}) {

     return (
          <div className={styles.layout} id="messages-id-container">
               <div style={{ display: "flex", flexDirection: "column" }} className={styles.inputMessage_container}>
                    <input type="text" onKeyDown={e => {
                         if (e.keyCode !== 13) return;
                         currentChannel.send(e.currentTarget.value);
                         e.currentTarget.value = "";
                    }} className={
                         styles.sendMessage_input
                    }
                    placeholder={`Message #${currentChannel?.channelInfo.name}`}

                    />
               </div>
               <div className={styles.messages_container}>
                    {messages.map((message) => (
                         <Message key={message.id} message={message} guild={currentGuild} />
                    ))}
               </div>


          </div>
     );
}