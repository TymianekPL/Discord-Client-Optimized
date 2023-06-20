import { Channel } from "../src/Discord";
import { MessageInfo } from "../src/Discord/datatypes";
import Message from "./Message";
import styles from "./MessageLayout.module.css";

export default function MessageLayout({ messages, currentChannel }: {
     messages: MessageInfo[],
     currentChannel: Channel;
}) {
     return (
          <div className={styles.layout}>
               <input type="text" onKeyDown={e => {
                    if(e.keyCode !== 13) return;
                    currentChannel.send(e.currentTarget.value);
                    e.currentTarget.value = "";
               }} />
               {messages.map((message) => (
                    <Message key={message.id} message={message} />
               ))}
          </div>
     );
}