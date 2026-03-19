import IStateModel from "../menu/IStateModel";

export enum NotificationType {
  SUCCESS = 1,
  ERROR = 2,
  INFO = 3,
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
  ownerId: number;
  ownerName: string | null;
  domainId: number;
  type: NotificationType;
  title: string;
  level: NotificationLevel;
  requestAt: string | null;
  seen: string | null;
  createdAt?: string;
  seenAt?: string;
  logId?: any;
  routingParams: IRoutingParams;
  messageId: number;
  messageParams?: any;
}
export interface IRoutingParams extends IStateModel {
  schemaId: string;
  culture: string;
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
  companyId: number;
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
