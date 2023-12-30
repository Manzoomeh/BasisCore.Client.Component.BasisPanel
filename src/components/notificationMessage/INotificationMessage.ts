export default interface INotifiationMessage {
  NotificationMessageMethod(
    Errorid: string,
    Lid: number,
    Type: number,
    Message?: string
  ): Promise<void>;
}
