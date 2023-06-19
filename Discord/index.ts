import { WebSocket } from "ws";
import { Constants } from "./constants";
import { ChannelInfo, MessageInfo, GuildInfo, UserInfo, Emoji, Role, Sticker, Intents } from './datatypes';
import { Event, EventMap } from "./Event";

function isValidEventKey(eventKey: string): eventKey is keyof EventMap {
     return (eventKey in {} as unknown as EventMap) as unknown as boolean;
}

export class Message {

}

export class Channel {
     private _authHeader: string = "";
     id: string = "";
     channelInfo: ChannelInfo = null;

     private constructor(authHeader: string) {
          this._authHeader = authHeader;
     }

     static async fetch(authHeader: string, id: string) {
          const channel = new Channel(authHeader);
          channel.id = id;

          const response = await fetch(`${Constants.API_BASE}/channels/${id}`, {
               headers: {
                    authorization: channel._authHeader,
                    "Content-Type": "application/json"
               }
          });
          const value = await Promise.all([
               Promise.resolve(response),
               response.json()
          ]);
          if (!value[0].ok) throw value[1];
          channel.channelInfo = value[1] as ChannelInfo;

          return channel;
     }

     toJSON(): ChannelInfo {
          return this.channelInfo;
     }

     toString() {
          return JSON.stringify(this.toJSON());
     }

     async send(message: MessageInfo | string) {
          const response = await fetch(`${Constants.API_BASE}/channels/${this.id}/messages`, {
               headers: {
                    authorization: this._authHeader,
                    "Content-Type": "application/json"
               },
               body: JSON.stringify(typeof message === "string" ?
                    {
                         content: message
                    } : message),
               method: "POST",
          });

          if (response.ok) return (await response.json()) as MessageInfo;
          else throw await response.json();
     }
}

export class Guild implements GuildInfo {
     private _authHeader: string = "";
     private guildInfo: GuildInfo;

     private constructor(authHeader: string) {
          this._authHeader = authHeader;
     }

     id: string;
     name: string;
     icon: string;
     description: string;
     home_header: null;
     splash: string;
     discovery_splash: string;
     features: string[];
     banner: string;
     owner_id: string;
     application_id: null;
     region: string;
     afk_channel_id: string;
     afk_timeout: number;
     system_channel_id: string;
     system_channel_flags: number;
     widget_enabled: boolean;
     widget_channel_id: string;
     verification_level: number;
     roles: Role[];
     default_message_notifications: number;
     mfa_level: number;
     explicit_content_filter: number;
     max_presences: null;
     max_members: number;
     max_stage_video_channel_users: number;
     max_video_channel_users: number;
     vanity_url_code: string;
     premium_tier: number;
     premium_subscription_count: number;
     preferred_locale: string;
     rules_channel_id: string;
     safety_alerts_channel_id: string;
     public_updates_channel_id: string;
     hub_type: null;
     premium_progress_bar_enabled: boolean;
     latest_onboarding_question_id: null;
     nsfw: boolean;
     nsfw_level: number;
     emojis: Emoji[];
     stickers: Sticker[];
     incidents_data: null;
     embed_enabled: boolean;
     embed_channel_id: string;

     static async fetch(authHeader: string, id: string) {
          const guild = new Guild(authHeader);
          guild.id = id;

          const response = await fetch(`${Constants.API_BASE}/guilds/${id}`, {
               headers: {
                    authorization: guild._authHeader,
                    "Content-Type": "application/json"
               }
          });
          const value = await Promise.all([
               Promise.resolve(response),
               response.json()
          ]);
          if (!value[0].ok) throw value[1];
          guild.guildInfo = value[1] as GuildInfo;

          Object.assign(guild, guild.guildInfo);

          return guild;
     }

     toJSON(): GuildInfo {
          return this.guildInfo;
     }

     toString() {
          return JSON.stringify(this.toJSON());
     }
}

export class Discord extends Event<keyof EventMap> {
     private _token: string;
     private userInfo: UserInfo;
     private bot: boolean;
     private heartbeatInterval: any;
     private sequenceNumber: number;
     socket: WebSocket;
     private reconnectInterval: number = 5000; // 5 seconds

     constructor(token: string) {
          super();

          this._token = token;

          this.connect();
     }

     private connect() {
          this.socket = new WebSocket(`wss://gateway.discord.gg/?v=9&encoding=json`);

          const p = new Promise(r => {
               // Connection opened
               this.socket.addEventListener("open", () => {
                    r(true);
               });
          });

          // Listen for messages
          this.socket.addEventListener("message", (event) => {
               const message = JSON.parse(event.data.toString());

               if (message.op === 10) {
                    // Handle HELLO message to start the heartbeat
                    const { heartbeat_interval } = message.d;
                    this.startHeartbeat(heartbeat_interval);

                    const identify = {
                         "op": 2,
                         "d": {
                              "token": this._token,
                              "intents": Intents.GUILDS | Intents.MESSAGE_CONTENT | Intents.GUILD_MESSAGES,
                              "properties": {
                                   "os": "windows",
                                   "browser": "my_library",
                                   "device": "my_library"
                              }
                         }
                    };

                    this.socket.send(JSON.stringify(identify));
               } else if (message.op === 11) {
                    // Handle HEARTBEAT ACK message
                    console.log("Received heartbeat ACK");
               } else if (message.op === 0) {
                    // Handle dispatched events
                    this.sequenceNumber = message.s;
                    this.handleEvent(message.t, message.d);
               }
          });

          // Handle errors
          this.socket.addEventListener('error', (error) => {
               console.error('Socket encountered an error:', error);
          });

          // Close the socket
          this.socket.addEventListener('close', (event) => {
               console.log('Disconnected from the Discord API.', event.code, event.reason);

               this.stopHeartbeat();

               if (event.code !== 1000) {
                    // Unexpected close, attempt reconnection
                    console.log('Reconnecting...');
                    setTimeout(() => this.connect(), this.reconnectInterval);
               }
          });

          return p;
     }

     private stopHeartbeat() {
          if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
     }

     async fetchChannel(id: string): Promise<Channel> {
          return Channel.fetch(this.authHeader(), id);
     }

     async fetchGuild(id: string): Promise<Guild> {
          return Guild.fetch(this.authHeader(), id);
     }

     private authHeader(): string {
          return this.bot ? `Bot ${this._token}` : this._token;
     }

     get user() {
          return this.userInfo;
     }

     private handleEvent(eventType: string, eventData: any) {
          switch (eventType) {
               case "READY":
                    this.userInfo = eventData.user;
                    this.emit("READY", this);
                    break;
               // Add cases for other event types you want to handle
               default:
                    const structurify = (obj: any): any => {
                         if (obj == null) return null;

                         const keys: any = {};

                         for (const key of Object.keys(obj)) {
                              const value = obj[key];
                              const type = typeof value;

                              if (type === "object") {
                                   keys[key] = structurify(value);
                              } else {
                                   keys[key] = value.constructor;
                              }
                         }

                         return keys;
                    };
                    let keys = structurify(eventData);

                    if(isValidEventKey(eventType))
                         this.emit(eventType, eventData);
                    else
                         console.log(eventType, keys);
                    break;
          }
     }

     private sendHeartbeat() {
          const payload = {
               op: 1
          };

          this.socket.send(JSON.stringify(payload));
     }

     private startHeartbeat(interval: number) {
          this.heartbeatInterval = setInterval(() => {
               this.sendHeartbeat();
          }, interval);
     }
}

export default Discord;