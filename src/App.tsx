/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Discord, { Channel } from "./Discord";
import { MessageInfo } from "./Discord/datatypes";

function App() {
     const [userToken, setUserToken] = useState("");
     const [discord, setDiscord] = useState<Discord | null>(null);
     const [loading, setLoading] = useState(true);
     const [loggedIn, setLoggedIn] = useState(false);
     const [error, setError] = useState("");
     const [messages, setMessages] = useState<MessageInfo[]>([]);

     const [currentChannel, setCurrentChannel] = useState<Channel>();

     const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setUserToken(event.target.value);
     };

     const fetchMessages = useCallback(async () => {
          const messagesInfo = await currentChannel?.fetchMessages();
          setMessages(messagesInfo || []);

          return messagesInfo || [];
     }, [messages, currentChannel]);


     const messageCreateCb = useCallback(
          async (message: MessageInfo) => {
               console.log("_tmp", discord);
               console.log("_tmp", messages);
               console.log("grg", currentChannel);
               console.log(messages);
               console.log("received", message.channel_id, currentChannel);
               if (message.channel_id !== currentChannel?.id) return;
               const newMessages = messages;
               console.log(newMessages);
               newMessages.push(message);
               setMessages(newMessages);
          },
          [discord, currentChannel, messages]
     );


     const login = useCallback((token?: string) => {
          setLoading(true);

          if(token == null) token = userToken;

          if (token) {
               const dc = new Discord(token);

               const idReady = dc.subscribe("READY", () => {
                    setDiscord(dc);
                    setLoggedIn(true);
                    setLoading(false);
                    setError("");

                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    localStorage.setItem("token", token);

                    dc.unsubscribe("READY", idReady);
               });

               const idFail = dc.subscribe("ERROR", err => {
                    setDiscord(dc);
                    setLoggedIn(false);
                    setLoading(false);
                    setError(err);

                    dc.unsubscribe("ERROR", idFail);
               });

               dc.subscribe("MESSAGE_CREATE", messageCreateCb);

               dc.subscribe("MESSAGE_DELETE", message => {
                    const newMessages = messages.filter(m => m.id != message.id);
                    setMessages(newMessages);
               });
          } else {
               setLoading(false);
          }

          setUserToken("");
     }, [discord, currentChannel, messages]);

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
                    <div>
                         {/* Render the normal page */}
                         <h1>Welcome, {discord?.user.global_name ?? discord?.user.username}</h1>

                         <input
                              value={currentChannel?.id}
                              onChange={async (e) => {
                                   const id = e.target.value;
                                   const ch = await discord?.fetchChannel(id);

                                   if(ch != null) {
                                        setCurrentChannel(ch);
                                        fetchMessages();
                                   }
                              }}
                         />

                         <ul>
                              <ul>
                                   {messages && messages.map((message, index) => (
                                        <div key={index} id={`msg-d-${message.id}`}>
                                             {/* Render each message */}
                                             <p>{message.author?.global_name ?? message.author?.username}: {message.content}</p>
                                        </div>
                                   ))}
                              </ul>
                         </ul>
                    </div>
               ) : (
                    <div className="login-form-container">
                         <div>
                              {/* Render the login page */}
                              <h1 style={{color:" white", opacity:".9"}}>Login Discord</h1>
                              <form onSubmit={handleSubmit}>
                                   <div>
                                        <input
                                             type="text"
                                             placeholder="Enter your token..."
                                             value={userToken}
                                             onChange={handleTokenChange}
                                        />
                                        <input type="submit" value="Login"/>
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
