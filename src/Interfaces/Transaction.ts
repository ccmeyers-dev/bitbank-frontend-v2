export interface TransactionItemProp {
  amount: number;
  current: number | null;
  date_created: string;
  duration: number | null;
  profit: number;
  progress: number | null;
  type: string;
  wallet: string;
  withdrawal_date: string;
}

export interface TransactionListProp {
  tx: TransactionItemProp;
  toggleShow: () => void;
}

export interface TransactionModalProp {
  tx: TransactionItemProp;
  show: boolean;
  closeModal: () => void;
}

export interface TransactionHeaderProp {
  type: string;
  amount: number;
  closeModal: () => void;
}
