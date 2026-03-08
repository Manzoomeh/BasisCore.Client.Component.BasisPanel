export default interface INotificationMessage {
  NotificationMessageMethod(
    Errorid: string,
    Lid: number,
    Type: number,
    Message?: string,
  ): Promise<void>;

  showByMessageIdAsync(
    messageId: number,
    params?: any,
    lid?: number,
    time?: number,
  ): Promise<void>;

  showByMessage(message: string, type?: number, time?: number): void;

  getMessageAsync(
    messageId: number,
    params?: any,
    lid?: number,
  ): Promise<IMessageInfo>;
}

export interface IMessageInfo {
  message: string;
  type: number;
}
