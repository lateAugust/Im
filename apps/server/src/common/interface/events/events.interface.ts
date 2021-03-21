import WebSocket from 'ws';

export interface UsersOnline {
  [key: number]: WebSocket;
}
