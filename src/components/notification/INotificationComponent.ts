import { INotificationItem } from "./INotificationItem";

export default interface INotificationComponent {
  getNotifications(): INotificationItem[];
  getNotificationsByType(type: number): INotificationItem[];
  sendWebSocketMessage(message: any): void;
  requestNotificationDetails(notificationId: string, companyId: number): void;
}
