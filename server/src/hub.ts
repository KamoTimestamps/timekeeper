import type { WebSocket } from 'ws';

interface Connection {
  socket: WebSocket;
  sessionId: string;
  deviceId: string;
  alive: boolean;
}

const HEARTBEAT_MS = 30_000;
/** Changes inside this window reach the overview page as one signal. */
const OVERVIEW_COALESCE_MS = 500;

/** An open event stream to a signed-in overview page. */
export interface OverviewStream {
  sessionId: string;
  signal(): void;
  end(): void;
}

/** Tracks authenticated sockets per user and fans changes out to a user's other devices. */
export class Hub {
  private readonly connections = new Map<string, Set<Connection>>();
  private readonly overviewStreams = new Map<string, Set<OverviewStream>>();
  private readonly overviewTimers = new Map<string, NodeJS.Timeout>();
  private readonly heartbeat: NodeJS.Timeout;

  constructor() {
    this.heartbeat = setInterval(() => this.sweep(), HEARTBEAT_MS);
    this.heartbeat.unref();
  }

  /** Closes the user's sockets and overview streams: those of one session, or all when no session is given. */
  closeSessions(userId: string, sessionId?: string): void {
    for (const conn of this.connections.get(userId) ?? []) {
      if (sessionId === undefined || conn.sessionId === sessionId) conn.socket.close(4401, 'session ended');
    }
    for (const stream of [...(this.overviewStreams.get(userId) ?? [])]) {
      if (sessionId === undefined || stream.sessionId === sessionId) stream.end();
    }
  }

  /** Registers an overview page's stream; the returned function unregisters it. */
  watchOverview(userId: string, stream: OverviewStream): () => void {
    let set = this.overviewStreams.get(userId);
    if (!set) this.overviewStreams.set(userId, (set = new Set()));
    set.add(stream);
    return () => {
      set.delete(stream);
      if (set.size === 0 && this.overviewStreams.get(userId) === set) this.overviewStreams.delete(userId);
    };
  }

  /** Tells the user's open overview pages to re-fetch. Bursts are coalesced into one signal. */
  notifyOverview(userId: string): void {
    if (!this.overviewStreams.has(userId) || this.overviewTimers.has(userId)) return;
    const timer = setTimeout(() => {
      this.overviewTimers.delete(userId);
      for (const stream of this.overviewStreams.get(userId) ?? []) stream.signal();
    }, OVERVIEW_COALESCE_MS);
    timer.unref();
    this.overviewTimers.set(userId, timer);
  }

  add(userId: string, sessionId: string, deviceId: string, socket: WebSocket): void {
    const conn: Connection = { socket, sessionId, deviceId, alive: true };
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
    for (const timer of this.overviewTimers.values()) clearTimeout(timer);
    this.overviewTimers.clear();
    for (const set of this.overviewStreams.values()) for (const stream of [...set]) stream.end();
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
