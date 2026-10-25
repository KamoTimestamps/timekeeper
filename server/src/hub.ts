import type { WebSocket } from 'ws';

interface Connection {
  socket: WebSocket;
  deviceId: string;
  alive: boolean;
}

const HEARTBEAT_MS = 30_000;

/** Tracks authenticated sockets per user and fans changes out to a user's other devices. */
export class Hub {
  private readonly connections = new Map<string, Set<Connection>>();
  private readonly heartbeat: NodeJS.Timeout;

  constructor() {
    this.heartbeat = setInterval(() => this.sweep(), HEARTBEAT_MS);
    this.heartbeat.unref();
  }

  add(userId: string, deviceId: string, socket: WebSocket): void {
    const conn: Connection = { socket, deviceId, alive: true };
    let set = this.connections.get(userId);
    if (!set) this.connections.set(userId, (set = new Set()));
    set.add(conn);

    socket.on('pong', () => {
      conn.alive = true;
    });
    socket.on('close', () => {
      set.delete(conn);
      if (set.size === 0 && this.connections.get(userId) === set) this.connections.delete(userId);
    });
  }

  /** Sends to every connection of the user except those from `exceptDeviceId`. */
  broadcast(userId: string, exceptDeviceId: string, message: unknown): void {
    const set = this.connections.get(userId);
    if (!set) return;
    const data = JSON.stringify(message);
    for (const conn of set) {
      if (conn.deviceId !== exceptDeviceId && conn.socket.readyState === conn.socket.OPEN) {
        conn.socket.send(data);
      }
    }
  }

  close(): void {
    clearInterval(this.heartbeat);
  }

  private sweep(): void {
    for (const set of this.connections.values()) {
      for (const conn of set) {
        if (!conn.alive) {
          conn.socket.terminate();
          continue;
        }
        conn.alive = false;
        conn.socket.ping();
      }
    }
  }
}
