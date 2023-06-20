/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Discord, { Channel } from "./Discord";
import { MessageInfo } from "./Discord/datatypes";
import MessageLayout from "../components/MessageLayout";
import ServerList from "../components/ServerList";


let g_messages: MessageInfo[] = [];
let g_currentChannel: Channel;
let g_setMessages: React.Dispatch<React.SetStateAction<MessageInfo[]>>;
let oldId = 0;

function App() {
     const [userToken, setUserToken] = useState("");
     const [discord, setDiscord] = useState<Discord | null>(null);
     const [loading, setLoading] = useState(true);
     const [loggedIn, setLoggedIn] = useState(false);
     const [error, setError] = useState("");
     const [messages, setMessages] = useState<MessageInfo[]>([]);

     g_setMessages = setMessages;

     const [currentChannel, setCurrentChannel] = useState<Channel>();

     const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setUserToken(event.target.value);
     };

     const fetchMessages = useCallback(async () => {
          const messagesInfo = await currentChannel?.fetchMessages();
          setMessages(messagesInfo || []);

          return messagesInfo || [];
     }, [currentChannel]);
     useEffect(() => {
          discord?.fetchChannel("1120075838147272775").then(channel => setCurrentChannel(channel));
     }, [discord]);

     useEffect(() => {
          g_messages = messages;
     }, [messages]);

     useEffect(() => {
          g_currentChannel = currentChannel!;
     }, [currentChannel]);

     const login = useCallback((token?: string) => {
          setLoading(true);

          if (token == null) token = userToken;

          if (token) {
               const dc = new Discord(token);

               const idReady = dc.subscribe("READY", () => {
                    setDiscord(dc);
                    setLoggedIn(true);
                    setLoading(false);
                    setError("");

                    localStorage.setItem("token", token!.trim());

                    dc.unsubscribe("READY", idReady);
               });

               const idFail = dc.subscribe("ERROR", err => {
                    setDiscord(dc);
                    setLoggedIn(false);
                    setLoading(false);
                    setError(err);

                    dc.unsubscribe("ERROR", idFail);
               });


               if (oldId) dc.unsubscribe("MESSAGE_CREATE", oldId);

               oldId = dc.subscribe("MESSAGE_CREATE", (message) => {
                    console.log("new message");
                    if (message.channel_id !== g_currentChannel?.id) return;
                    g_setMessages((prevMessages) => [message, ...prevMessages]);
               });

               dc.subscribe("MESSAGE_DELETE", message => {
                    const newMessages = g_messages.filter(m => m.id != message.id);
                    g_setMessages(newMessages);
               });
          } else {
               setLoading(false);
          }

          setUserToken("");
     }, []);

     useEffect(() => {
          setLoading(false);

          if (localStorage.getItem("token") && !loggedIn) {
               setUserToken(localStorage.getItem("token")?.toString() ?? "");
               login(localStorage.getItem("token")?.toString() ?? "");
          }

          console.log(currentChannel);
          console.log(fetchMessages());
     }, [currentChannel]);

     const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault(); // Prevent form submission

          login();
     };

     if (loading) {
          return <div>Loading...</div>; // Render a loading screen
     }

     return (
          <>
               {loggedIn ? (
                    <>
                         <div style={{position: "fixed", top: "0"}}>
                              <input
                                   value={currentChannel?.id}
                                   onChange={async (e) => {
                                        const id = e.target.value;
                                        const ch = await discord?.fetchChannel(id);

                                        if (ch != null) {
                                             setCurrentChannel(ch);
                                             fetchMessages();
                                        }
                                   }}
                              />
                         </div>

                         <main>
                              <ServerList discord={discord!} />

                              <MessageLayout messages={messages} currentChannel={currentChannel!} />
                         </main>
                    </>
               ) : (
                    <div className="login-form-container">
                         <div>
                              {/* Render the login page */}
                              <h1 style={{ color: " white", opacity: ".9" }}>Login Discord</h1>
                              <form onSubmit={handleSubmit}>
                                   <div>
                                        <input
                                             type="text"
                                             placeholder="Enter your token..."
                                             value={userToken}
                                             onChange={handleTokenChange}
                                        />
                                        <input type="submit" value="Login" />
                                   </div>
                              </form>
                              {error && <p className="error">{error}</p>}
                         </div>
                    </div>

               )}
          </>
     );
}

export default App;
