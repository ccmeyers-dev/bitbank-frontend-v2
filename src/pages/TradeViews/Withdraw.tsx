import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonText,
  IonList,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  NavContext,
} from "@ionic/react";
import {
  arrowBack,
  arrowForward,
  ellipse,
  checkmarkDoneOutline,
  checkmark,
  close,
} from "ionicons/icons";
import Refresher from "../../components/utils/Refresher";
import "./styles/Withdraw.scss";
import { HistoryIconSelector, fullDate } from "../../components/utils/Utils";
import axiosInstance from "../../services/baseApi";
import { useCoinValue } from "../../Hooks/CoinValueHook";
import { LoadingList } from "../../components/ListLoader";
import { useParams } from "react-router";
import { useWallets } from "../../Hooks/WalletsHook";
import { useProfile } from "../../Hooks/ProfileHook";
import useSecureRequest from "../../Hooks/SecureRequest";

interface WithdrawalItemProp {
  id: number;
  wallet: string;
  billings: {
    id: number;
    title: string;
    amount: number;
    withdrawal: number;
  }[];
  amount: number;
  date_created: string;
  type: string;
  completed: boolean;
  portfolio: number;
}

interface ItemProp {
  toggleDetail: () => void;
  withdrawal: WithdrawalItemProp;
}
const WithdrawalItem: React.FC<ItemProp> = ({
  toggleDetail,
  withdrawal: { type, amount, wallet, date_created },
}) => {
  return (
    <IonItem onClick={toggleDetail} className="HistoryListItem ion-no-padding">
      <div className="icon">
        <IonIcon icon={HistoryIconSelector(type)} />
      </div>
      <IonLabel className="description">
        <h3>{wallet} wallet</h3>
        <p>
          Withdrawal from {wallet} wallet {date_created}
        </p>
      </IonLabel>
      <IonLabel className="amount">
        <h5>{amount} USD</h5>
        <p>
          {useCoinValue(wallet, amount)} {wallet}
        </p>
      </IonLabel>
    </IonItem>
  );
};

interface ListProp {
  toggleDetail: (detail: any) => void;
  withdrawals: WithdrawalItemProp[];
}

const WithdrawalList: React.FC<ListProp> = ({ toggleDetail, withdrawals }) => {
  return (
    <IonList mode="ios">
      {withdrawals.length > 0 ? (
        withdrawals.map((withdrawal) => (
          <WithdrawalItem
            withdrawal={withdrawal}
            key={withdrawal.id}
            toggleDetail={() => toggleDetail(withdrawal)}
          />
        ))
      ) : (
        <IonText className="no-result">
          <h3>You have no activity</h3>
          <p>Your withdrawals will show up here</p>
        </IonText>
      )}
    </IonList>
  );
};

interface WithdrawalDetailProp {
  detail: {
    id: number;
    billings: {
      id: number;
      title: string;
      amount: number;
      paid: boolean;
      withdrawal: number;
    }[];
    wallet: string;
    amount: number;
    date_created: string;
    type: string;
    completed: boolean;
    portfolio: 1;
  };
}
const WithdrawalDetail: React.FC<WithdrawalDetailProp> = ({
  detail: { billings, wallet, amount, completed, date_created },
}) => {
  return (
    <div className="detail">
      {!completed && (
        <>
          {billings.length > 0 && <h5>Outstanding fees</h5>}
          <div className="outstanding">
            {billings.length > 0 ? (
              billings.map(({ id, title, amount }) => (
                <div key={id} className="entry">
                  <h5>
                    {title} <IonIcon icon={ellipse}></IonIcon>
                  </h5>
                  <p>{amount} USD</p>
                </div>
              ))
            ) : (
              <div className="empty">
                <h5>Pending confirmation...</h5>
              </div>
            )}
          </div>
        </>
      )}

      <div className="status">
        <div className="entry">
          <h5>Amount</h5>
          <p>{amount} USD</p>
        </div>
        <div className="entry">
          <h5>Wallet</h5>
          <p>{wallet} wallet</p>
        </div>
        <div className="entry">
          <h5>Date</h5>
          <p>{fullDate(date_created)}</p>
        </div>
        <div className={`entry ${completed ? "completed" : "pending"}`}>
          <h5>Completed</h5>
          <IonIcon icon={completed ? checkmark : close} />
        </div>
      </div>
    </div>
  );
};

interface ActionProp {
  show: boolean;
  closeDetail: () => void;
  requested: boolean;
  request: () => void;
  valid: boolean;
  wallet: string;
  loading: boolean;
}
const ActionButton: React.FC<ActionProp> = ({
  show,
  closeDetail,
  request,
  requested,
  valid,
  wallet,
  loading,
}) => {
  return (
    <div className="button">
      {show ? (
        <IonButton
          mode="ios"
          color="medium"
          className="close"
          onClick={closeDetail}
          disabled={false}
        >
          <IonIcon icon={arrowBack} />
          <p>Back</p>
        </IonButton>
      ) : (
        <IonButton disabled={valid ? false : true} mode="ios" onClick={request}>
          {requested ? (
            <p>Ok</p>
          ) : valid ? (
            loading ? (
              <p>Processing...</p>
            ) : (
              <>
                <p>Withdraw {wallet}</p>
                <IonIcon icon={arrowForward} />
              </>
            )
          ) : (
            <p>Insufficient Funds</p>
          )}
        </IonButton>
      )}
    </div>
  );
};

interface SuccessCardProp {
  responseAmount: number;
}
const SuccessCard: React.FC<SuccessCardProp> = ({ responseAmount }) => {
  return (
    <div className="success-card">
      <h3>
        Request successful <br />
        <br />
        {responseAmount} USD
      </h3>
      <IonIcon icon={checkmarkDoneOutline} />
      <p className="prompt">
        You would be prompted to add your withdrawal details after confirmation{" "}
        <br />
        Please do not resend withdrawal request.
      </p>
      <p className="monitor">Monitor your withdrawal below</p>
    </div>
  );
};

const Withdraw: React.FC = () => {
  const [withdrawAmount, setWithdrawAmount] = useState<number | null>();
  const [responseAmount, setResponseAmount] = useState<number | null>();
  const [detail, setDetail] = useState<WithdrawalDetailProp | any>({});
  const [showDetail, setShowDetail] = useState(false);
  const [requested, setRequested] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [wallet, setWallet] = useState("BTC");
  const [selectedWallet, setSelectedWallet] = useState<any>();

  // const [withdrawals, setWithdrawals] = useState([]);

  const { goBack } = useContext(NavContext);

  const { symbol }: any = useParams();

  const { data: profile } = useProfile();
  const { data: wallets } = useWallets();
  const { data: allWithdrawals, update } = useSecureRequest(
    "/users/withdrawals/"
  );

  const available = () => {
    if (!profile) {
      return 0.0;
    } else {
      switch (wallet) {
        case "BTC":
          return profile?.btc_available;
        case "ETH":
          return profile?.eth_available;
        case "XRP":
          return profile?.xrp_available;
        case "LTC":
          return profile?.ltc_available;
        default:
          return 0.0;
      }
    }
  };

  const valid = (withdrawAmount ? withdrawAmount : 0) <= available()!;

  const pendingWithdrawal = () => {
    const walletWithdrawals = allWithdrawals.filter(
      (w: any) => w.wallet === wallet
    );
    const isPending = walletWithdrawals.some(
      (w: WithdrawalItemProp) => w.completed === false
    );
    return isPending;
  };

  const minimumErrorToast = async () => {
    const toast = document.createElement("ion-toast");
    toast.message = "Unable to process withdrawal - Account limit";
    toast.duration = 4000;

    document.body.appendChild(toast);
    return toast.present();
  };

  const pendingWithdrawalToast = async () => {
    const toast = document.createElement("ion-toast");
    toast.message = "You have a pending withdrawal, please wait...";
    toast.duration = 4000;

    document.body.appendChild(toast);
    return toast.present();
  };

  const RequestWithdrawal = () => {
    if (withdrawAmount && !requested) {
      if (withdrawAmount < 2000) {
        minimumErrorToast();
      } else if (pendingWithdrawal()) {
        pendingWithdrawalToast();
      } else {
        setLoadingRequest(true);

        axiosInstance
          .post("users/withdrawals/", {
            wallet: selectedWallet?.symbol,
            amount: withdrawAmount,
            completed: false,
            portfolio: profile?.id,
            date_created: null,
          })
          .then((res) => {
            setResponseAmount(res.data.amount);
            setRequested(true);
            setWithdrawAmount(null);
            setLoadingRequest(false);
            update();
          })
          .catch((err) => {
            // console.log(err.response);
            setLoadingRequest(false);
          });
      }
    } else if (requested) {
      setRequested(false);
      setWithdrawAmount(null);
    }
  };

  useEffect(() => {
    if (symbol) {
      setWallet(symbol.toUpperCase());
    }
  }, [symbol]);

  useEffect(() => {
    if (wallets) {
      const selected = wallets.find((w) => w.symbol === wallet);
      setSelectedWallet(selected);
    }
  }, [wallet, wallets]);

  let withdrawals: any;

  if (allWithdrawals) {
    if (wallet) {
      const results = allWithdrawals.filter((w: any) => w.wallet === wallet);
      withdrawals = results;
    } else {
      withdrawals = allWithdrawals;
    }
  }

  return (
    <IonPage>
      <IonContent className="Withdraw ion-padding">
        {/* refresher */}
        <Refresher />
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/home")}
        />
        <IonSegment
          value={wallet}
          onIonChange={(e) => setWallet(e.detail.value!)}
        >
          {wallets &&
            wallets.map(({ symbol, id }) => (
              <IonSegmentButton key={id} value={symbol}>
                <IonLabel>{symbol}</IonLabel>
              </IonSegmentButton>
            ))}
        </IonSegment>
        <div onClick={() => setWithdrawAmount(available())} className="balance">
          <p className="wallet">
            MAX <span>{available()} USD</span>
          </p>
        </div>
        <div className="search-box">
          <IonInput
            type="number"
            value={withdrawAmount}
            placeholder="Enter amount to withdraw"
            onIonChange={(e) => setWithdrawAmount(parseFloat(e.detail.value!))}
            clearInput
          />
        </div>
        {requested && <SuccessCard responseAmount={responseAmount!} />}
        <ActionButton
          show={showDetail}
          requested={requested}
          request={RequestWithdrawal}
          closeDetail={() => setShowDetail(false)}
          valid={valid}
          wallet={wallet}
          loading={loadingRequest}
        />
        {showDetail ? (
          <WithdrawalDetail detail={detail} />
        ) : !allWithdrawals ? (
          <LoadingList />
        ) : (
          <WithdrawalList
            toggleDetail={(detail: any) => {
              setDetail(detail);
              setShowDetail(true);
            }}
            withdrawals={withdrawals}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Withdraw;
