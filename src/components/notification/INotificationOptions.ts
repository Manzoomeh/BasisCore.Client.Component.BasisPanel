export interface INotificationOptions {
  websocketUrl: string; // URL برای اتصال WebSocket
  reconnectInterval?: number; // فاصله زمانی برای reconnect (میلی‌ثانیه) - پیش‌فرض: 3000
  autoReconnect?: boolean; // reconnect خودکار - پیش‌فرض: true
}
