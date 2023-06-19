import { useState, useEffect } from "react";
import "./App.css";
import Discord from "./Discord";

function App() {
     const [userToken, setUserToken] = useState("");
     const [discord, setDiscord] = useState<Discord | null>(null);
     const [loading, setLoading] = useState(true);
     const [loggedIn, setLoggedIn] = useState(false);
     const [error, setError] = useState("");

     const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setUserToken(event.target.value);
     };

     const login = (token?: string) => {
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
          } else {
               setLoading(false);
          }

          setUserToken("");
     };

     useEffect(() => {
          setLoading(false);

          if (localStorage.getItem("token") && !loggedIn) {
               setUserToken(localStorage.getItem("token")?.toString() ?? "");
               login(localStorage.getItem("token")?.toString() ?? "");
          }
     }, []);

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
                    </div>
               ) : (
                    <div>
                         {/* Render the login page */}
                         <h1>Login Page</h1>
                         <form onSubmit={handleSubmit}>
                              <input
                                   type="text"
                                   placeholder="Enter your token..."
                                   value={userToken}
                                   onChange={handleTokenChange}
                              />
                              <input type="submit" value="Submit" />
                              <button type="button" onClick={() => setUserToken("")}>
                                   Clear Token
                              </button>
                         </form>
                         {error && <p className="error">{error}</p>}
                    </div>
               )}
          </>
     );
}

export default App;
