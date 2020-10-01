import useSecureRequest from "./SecureRequest";
import { WalletProp } from "../Interfaces/Wallet";

export const useWallets = () => {
  const { data }: { data: WalletProp[] } = useSecureRequest("/users/wallets/");
  return { data };
};
