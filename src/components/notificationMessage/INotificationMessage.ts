export default interface INotifiationMessage {
  NotificationMessage(
    Errorid: string,
    Lid: number,
    Type: number,
    Message?: string
  ): Promise<void>;
}
