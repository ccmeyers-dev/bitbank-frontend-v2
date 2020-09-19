export interface WalletProp {
  id: number;
  wallet: string;
  symbol: string;
  address: string;
}

export interface WalletItemProp {
  wallet: WalletProp;
}

export interface WalletAddressProps {
  show: boolean;
  closeModal: () => void;
  wallet: WalletProp;
}

export interface WalletSelectorProp {
  symbol: string;
  balance: string;
  walletSetter: () => void;
}
