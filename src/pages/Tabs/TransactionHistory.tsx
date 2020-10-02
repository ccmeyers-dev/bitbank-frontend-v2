import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonText,
  IonList,
  IonModal,
  IonItem,
  IonLabel,
  IonListHeader,
  IonLoading,
} from "@ionic/react";

// styles
import "./styles/TransactionHistory.scss";

import {
  closeCircle,
  cardOutline,
  chevronDown,
  chevronUp,
} from "ionicons/icons";
import Refresher from "../../components/utils/Refresher";
import HistoryListItem from "../../components/HistoryListItem";
import TransactionDetailModal from "../../components/TransactionDetailModal";
import { TransactionItemProp } from "../../Interfaces/Transaction";

//mock data
import { useCoinValue } from "../../Hooks/CoinValueHook";
import { WalletSelectorProp } from "../../Interfaces/Wallet";
import { LoadingList } from "../../components/ListLoader";
import { useWallets } from "../../Hooks/WalletsHook";
import { useProfile } from "../../Hooks/ProfileHook";
import useSecureRequest from "../../Hooks/SecureRequest";

const WalletSelector: React.FC<WalletSelectorProp> = ({
  symbol,
  balance,
  walletSetter,
}) => {
  const amount = useCoinValue(symbol, parseFloat(balance));
  const wallet = () => {
    switch (symbol) {
      case "BTC":
        return "bitcoin";
      case "ETH":
        return "ethereum";
      case "LTC":
        return "litecoin";
      case "XRP":
        return "ripple";
      default:
        return "steem";
    }
  };
  return (
    <IonItem onClick={walletSetter} lines="full" className="ion-no-padding">
      <div className="icon" slot="start">
        <IonIcon src={`coins/${wallet()}.svg`} />
      </div>
      <IonLabel className="description">
        <h3>
          {symbol} {symbol === "All" && "Wallets"}
        </h3>
        <p>{symbol === "All" ? "Total" : "Wallet"} Balance</p>
      </IonLabel>
      <IonLabel className="amount">
        <h5>{balance} USD</h5>
        {symbol !== "All" && (
          <p>
            {amount} {symbol}
          </p>
        )}
      </IonLabel>
    </IonItem>
  );
};
const TransactionHistory: React.FC = () => {
  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const [wallet, setWallet] = useState("All");
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState<TransactionItemProp | null>(null);

  const { data: wallets } = useWallets();

  const { data: allTransactions } = useSecureRequest("/users/transactions/");

  let transactions: TransactionItemProp[];
  if (wallet !== "All") {
    const results = allTransactions.filter((tx: any) => tx.wallet === wallet);
    transactions = results;
  } else {
    transactions = allTransactions;
  }

  const transactionToast = async (amount: number, order: string) => {
    const toast = document.createElement("ion-toast");
    toast.message = `Transaction: ${order} of ${amount} USD`;
    toast.duration = 4000;

    document.body.appendChild(toast);
    return toast.present();
  };

  const handleDetail = (tx: TransactionItemProp) => {
    if (tx.type === "buy" || tx.type === "sell" || tx.type === "smart") {
      setDetail(tx);
      setShowDetail(true);
    } else if (tx.type === "deposit" || tx.type === "withdrawal") {
      transactionToast(tx.amount, tx.type);
    }
  };

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
        return profile?.available;
    }
  };

  const walletBalance = (symbol: string) =>
    !profile ? "0.00" : available(symbol)!.toFixed(2);

  return (
    <IonPage className="TransactionHistory">
      <IonContent>
        {/* refresher */}
        <Refresher />
        {!allTransactions ? (
          <IonLoading
            cssClass="my-custom-loading"
            isOpen={true}
            message={"Please wait..."}
            duration={5000}
          />
        ) : (
          <>
            <IonListHeader>
              <h1>Transactions</h1>
            </IonListHeader>
            <div className="WalletHeader">
              <IonItem
                onClick={() => setShowSelectorModal(true)}
                lines="full"
                className="ion-no-"
              >
                <div className="icon">
                  <IonIcon icon={cardOutline} />
                </div>
                <IonLabel className="description">
                  <h3>
                    {wallet === "All" ? "All Wallets" : `${wallet} Wallet`}
                  </h3>
                  <p>
                    {walletBalance(wallet)} {wallet === "All" ? "USD" : wallet}
                  </p>
                </IonLabel>
                <IonIcon icon={showSelectorModal ? chevronUp : chevronDown} />
              </IonItem>
            </div>
            {!allTransactions ? (
              <LoadingList />
            ) : (
              <IonList mode="ios">
                {transactions.length > 0 ? (
                  transactions.map((tx, i) => (
                    <HistoryListItem
                      toggleShow={() => handleDetail(tx)}
                      key={i}
                      tx={tx}
                    />
                  ))
                ) : (
                  <IonText className="no-result">
                    <h3>You have no activity</h3>
                    <p>All your transactions will show up here</p>
                  </IonText>
                )}
              </IonList>
            )}
            <IonModal
              isOpen={showSelectorModal}
              swipeToClose={true}
              cssClass="wallet-selector"
              onDidDismiss={() => setShowSelectorModal(false)}
            >
              <IonHeader className="ion-no-border" mode="ios">
                <IonToolbar>
                  <IonTitle>Select a Wallet</IonTitle>
                  <IonIcon
                    className="back-button"
                    icon={closeCircle}
                    onClick={() => setShowSelectorModal(false)}
                    slot="end"
                  />
                </IonToolbar>
              </IonHeader>
              <IonContent>
                <IonList mode="ios">
                  <WalletSelector
                    symbol="All"
                    balance={walletBalance("All")}
                    walletSetter={() => {
                      setWallet("All");
                      setShowSelectorModal(false);
                    }}
                  />
                  {wallets &&
                    wallets.map(({ symbol }) => (
                      <WalletSelector
                        key={symbol}
                        symbol={symbol}
                        balance={walletBalance(symbol)}
                        walletSetter={() => {
                          setWallet(symbol);
                          setShowSelectorModal(false);
                        }}
                      />
                    ))}
                </IonList>
              </IonContent>
            </IonModal>
            <TransactionDetailModal
              show={showDetail}
              closeModal={() => setShowDetail(false)}
              tx={detail!}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TransactionHistory;
