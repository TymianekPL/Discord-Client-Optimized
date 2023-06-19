import Discord, { Guild } from ".";
import { MessageInfo, UserInfo } from "./datatypes";

export type PresenceEvent = {
     user: UserInfo;
     status: string;
     last_modified: number;
     client_status: { mobile: string };
     broadcast: null;
     activities: object;
};

export type MessageDelete = {
     id: string;
     channel_id: string;
     guild_id: string;
}

export type EventMap = {
     MESSAGE_CREATE: [MessageInfo];
     GUILD_CREATE: [Guild];
     READY: [Discord];
     MESSAGE_DELETE: [MessageDelete];
     PRESENCE_UPDATE: [PresenceEvent];
     ERROR: [string];
};

export type EventCallback<T extends keyof EventMap> = (...args: EventMap[T]) => void;

export class Event<T extends keyof EventMap> {
     private events: Map<T, Map<number, EventCallback<T>>> = new Map();
     private nextId = 0;

     protected emit<K extends T>(event: K, ...args: EventMap[K]): void {
          const callbacks = this.events.get(event);
          if (callbacks) {
               callbacks.forEach((callback) => callback(...args));
          }
     }

     subscribe<K extends T>(event: K, callback: EventCallback<K>): number {
          if (!this.events.has(event)) {
               this.events.set(event, new Map());
          }

          const eventId = this.nextId++;
          this.events.get(event)?.set(eventId, callback);
          return eventId;
     }

     unsubscribe<K extends T>(event: K, eventId: number): void {
          const callbacks = this.events.get(event);
          if (callbacks) {
               callbacks.delete(eventId);
          }
     }
}