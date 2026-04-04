export type IMessageTemplateValue = Record<
  string,
  string | number | boolean | null | undefined
>;

export default interface INotificationMessage {
  NotificationMessageMethod(
    Errorid: string | number,
    Lid?: number,
    Type?: number,
    Message?: string,
    templateValue?: IMessageTemplateValue,
    time?: number,
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
  ): Promise<IMessageInfo | null>;

  getMessageTypeByErrorId(errorid: number): Promise<number | null>;
}

export interface IMessageInfo {
  message: string;
  type: number;
}
