export interface NotificationProp {
  id: number;
  title: string;
  body: string;
  read: boolean;
  portfolio: number;
}

export interface NotificationListProp {
  notifications: NotificationProp[];
  open: (
    id: number,
    title: string,
    body: string,
    read: boolean,
    portfolio: number
  ) => void;
}
