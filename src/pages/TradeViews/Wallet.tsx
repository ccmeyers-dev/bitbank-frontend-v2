import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonText,
  IonList,
  IonLoading,
  NavContext,
} from "@ionic/react";
import "./styles/Wallet.scss";
import { arrowBack, qrCode } from "ionicons/icons";
import Refresher from "../../components/utils/Refresher";
import HistoryListItem from "../../components/HistoryListItem";
import TransactionDetailModal from "../../components/TransactionDetailModal";
import WalletAddressModal from "../../components/WalletAddressModal";
import { TransactionItemProp } from "../../Interfaces/Transaction";
import { useParams } from "react-router";

//mock data
import { useCoinValue } from "../../Hooks/CoinValueHook";
import { ErrorList, LoadingList } from "../../components/ListLoader";
import { useWallets } from "../../Hooks/WalletsHook";
import { useProfile } from "../../Hooks/ProfileHook";
import useSecureRequest from "../../Hooks/SecureRequest";

const Wallet: React.FC = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState<TransactionItemProp | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [wallet, setWallet] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { goBack } = useContext(NavContext);

  const { symbol } = useParams();

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

  const { data: wallets } = useWallets();

  const { data: profile } = useProfile();

  const { data: allTransactions } = useSecureRequest("/users/transactions/");

  let transactions: TransactionItemProp[];
  if (symbol && allTransactions) {
    const results = allTransactions.filter(
      (tx: any) => tx.wallet === symbol.toUpperCase()
    );
    transactions = results;
  } else {
    transactions = [];
  }

  const available = () => {
    switch (symbol) {
      case "btc":
        return profile?.btc_available;
      case "eth":
        return profile?.eth_available;
      case "ltc":
        return profile?.ltc_available;
      case "xrp":
        return profile?.xrp_available;
      default:
        return profile?.btc_available;
    }
  };

  const walletBalance = !profile ? "0.00" : available()!.toFixed(2);

  useEffect(() => {
    // console.log("wallet... ", wallet, loading, error);
    setLoading(true);
    if (wallets) {
      const result = wallets.find((w) => w.symbol === symbol.toUpperCase());
      if (result !== undefined) {
        setWallet(result);
        setLoading(false);
        setError(false);
      } else {
        setError(true);
        setLoading(false);
      }
    }
  }, [symbol, wallets]);

  const balance = useCoinValue(symbol.toUpperCase(), parseFloat(walletBalance));

  return (
    <IonPage className="Wallet">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack("/en/home")}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>{wallet.wallet} Wallet</IonTitle>
          <IonIcon
            className="qr-code"
            icon={qrCode}
            slot="end"
            onClick={() => setShowModal(true)}
          />
        </IonToolbar>
      </IonHeader>
      {loading ? (
        <IonLoading
          cssClass="my-custom-loading"
          isOpen={true}
          message={"Loading wallet..."}
          duration={5000}
        />
      ) : error ? (
        <ErrorList />
      ) : (
        <>
          <IonContent>
            {/* refresher */}
            <Refresher />

            <IonText>
              <h1>
                {walletBalance}
                <p>USD</p>
              </h1>
              <p>
                {balance} {symbol.toUpperCase()}
              </p>
            </IonText>
            <div className="buttons">
              <div className={`buy-sell ${symbol}`}>
                <IonButton routerLink={`/tx/exchange/${symbol}`} mode="ios">
                  <p>Trade</p>
                </IonButton>
                <IonButton routerLink={`/tx/withdraw/${symbol}`} mode="ios">
                  <p>Withdraw</p>
                </IonButton>
              </div>
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
            <TransactionDetailModal
              show={showDetail}
              closeModal={() => setShowDetail(false)}
              tx={detail!}
            />

            <WalletAddressModal
              show={showModal}
              closeModal={() => setShowModal(false)}
              wallet={wallet}
            />
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default Wallet;
