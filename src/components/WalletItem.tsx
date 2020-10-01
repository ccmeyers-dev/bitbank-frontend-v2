import React from "react";
import { WalletItemProp } from "../Interfaces/Wallet";
import { IonItem, IonLabel, IonText, IonIcon } from "@ionic/react";
import "./styles/WalletItem.scss";
import { useCoinValue } from "../Hooks/CoinValueHook";
import { useProfile } from "../Hooks/ProfileHook";

export const WalletItem: React.FC<WalletItemProp> = ({
  wallet: { wallet, symbol },
}) => {
  const { data: profile } = useProfile();

  const available = (symbol: string) => {
    switch (symbol) {
      case "BTC":
        return profile?.btc_available;
      case "ETH":
        return profile?.eth_available;
      case "LTC":
        return profile?.ltc_available;
      case "XRP":
        return profile?.xrp_available;
      default:
        return profile?.btc_available;
    }
  };

  const walletBalance = (symbol: string) =>
    !profile ? "0.00" : available(symbol)!.toFixed(2);

  return (
    <IonItem
      routerLink={`/tx/wallet/${symbol.toLowerCase()}`}
      className="WalletItem ion-no-padding"
    >
      <IonIcon src={`coins/${wallet}.svg`} />
      <IonLabel className="coin-label">
        <IonText>
          <h3>{wallet}</h3>
        </IonText>
      </IonLabel>
      <IonLabel className="ion-text-end coin-label" slot="end">
        <IonText>
          <h5>{useCoinValue(symbol, parseFloat(walletBalance(symbol)))}</h5>
          <h4>{walletBalance(symbol)} USD</h4>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};
