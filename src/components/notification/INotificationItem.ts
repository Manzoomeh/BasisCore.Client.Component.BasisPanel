export enum NotificationType {
  ERROR = 1,
  WARNING = 2,
  NOTICE = 3,
  OTHER = 4,
}

export enum NotificationLevel {
  USER = 1,
  CORPORATE = 2,
  BUSINESS = 3,
}

export interface INotificationItem {
  id: string;
  userId: string | null;
  ownerId: string | null;
  domainId: string | null;
  type: NotificationType;
  title: string;
  level: NotificationLevel;
  requestAt: string | null;
  seen: string | null;
  createdAt?: string;
  seenAt?: string;
  logId?: any;
}

export interface INotificationListResponse {
  action: "notification-list";
  notifications: INotificationItem[];
}

export interface INotificationDetailsResponse {
  action: "notification-details";
  notification: INotificationItem;
}

export interface INotificationGetListRequest {
  action: "get-list";
}

export interface INotificationGetDetailsRequest {
  action: "get-details";
  notificationId: string;
}

export interface INotificationPushResponse {
  action: "notification";
  notification: INotificationItem;
}

export interface INotificationSeenResponse {
  action: "notification-seen";
  notificationId: string;
  seenAt: string;
}
