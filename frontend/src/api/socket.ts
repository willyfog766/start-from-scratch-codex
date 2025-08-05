export class BazaarSocket {
  private ws: WebSocket;
  private subscriptions = new Map<string, Set<(data: any) => void>>();

  constructor() {
    this.ws = new WebSocket('ws://localhost:3002');
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subscriptions.get(data.itemId)?.forEach((cb) => cb(data));
    };
  }

  subscribe(itemId: string, callback: (data: any) => void) {
    if (!this.subscriptions.has(itemId)) {
      this.subscriptions.set(itemId, new Set());
      this.ws.send(JSON.stringify({ type: 'subscribe', itemId }));
    }
    this.subscriptions.get(itemId)?.add(callback);
  }
}
