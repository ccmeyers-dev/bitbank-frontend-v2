import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../services/baseApi";
import { WalletProp } from "../Interfaces/Wallet";

type walletContextProp = {
  wallets: WalletProp[];
  loading: boolean;
  error: boolean;
};
const WalletContext = createContext<walletContextProp>({
  wallets: [],
  loading: true,
  error: false,
});

type Props = {
  children: React.ReactNode;
};

const WalletProvider = ({ children }: Props) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWallets = () => {
    // console.log("fetching wallet...");
    axiosInstance
      .get("users/wallets/")
      .then((res) => {
        setWallets(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <WalletContext.Provider value={{ wallets, loading, error }}>
      {children}
    </WalletContext.Provider>
  );
};
const useWallets = () => useContext(WalletContext);

export { WalletProvider, useWallets };
