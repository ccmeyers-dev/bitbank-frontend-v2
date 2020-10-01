import React, { useState, useEffect, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonText,
  IonButton,
  IonToast,
  IonSelect,
  IonSelectOption,
  NavContext,
} from "@ionic/react";
import "./styles/BuySell.scss";
import { arrowBack } from "ionicons/icons";
import NumberInput from "../../components/NumberInput";
import Refresher from "../../components/utils/Refresher";
import { useParams, useHistory } from "react-router";
import axiosInstance from "../../services/baseApi";
import { WalletProp } from "../../Interfaces/Wallet";
import { useWallets } from "../../Hooks/WalletsHook";
import { useProfile } from "../../Hooks/ProfileHook";

const BuySell: React.FC = () => {
  const [mainValue, setMainValue] = useState<string>("0");
  const [duration, setDuration] = useState<number>(7);
  const [selectedWallet, setSelectedWallet] = useState<
    WalletProp | undefined
  >();
  const [showToast, setShowToast] = useState(false);

  const { goBack } = useContext(NavContext);
  const history = useHistory();

  const handleInput = (action: string) => {
    let newValue: string;
    const value = mainValue;
    if (action === "del") {
      newValue = value.length <= 1 ? "0" : value.slice(0, -1);
    } else if (value.length >= 10) {
      newValue = value;
    } else if (value === "0") {
      newValue = action;
    } else if (value === ".") {
      newValue = "0." + action;
    } else if (action === "." && value.includes(".")) {
      newValue = value;
    } else {
      newValue = value + action;
    }
    setMainValue(newValue);
  };

  const { wallet, order } = useParams();

  const { data: profile, update } = useProfile();

  const orderTheme = () => {
    switch (order) {
      case "buy":
        return "success";
      case "sell":
        return "danger";
      case "smart":
        return "primary";
      default:
        return "success";
    }
  };
  const available = () => {
    switch (wallet) {
      case "btc":
        return profile?.btc_available;
      case "eth":
        return profile?.eth_available;
      case "xrp":
        return profile?.xrp_available;
      case "ltc":
        return profile?.ltc_available;
      default:
        return 0.0;
    }
  };
  const main = isNaN(parseFloat(mainValue)) ? 0 : parseFloat(mainValue);

  const valid = main <= available()!;

  const maxValue = !profile ? "0.00" : available()!.toString();

  const { data: wallets } = useWallets();

  // const selectedWallet = wallets.find((w) => w.symbol === wallet.toUpperCase());

  useEffect(() => {
    if (wallets) {
      const selected = wallets.find((w) => w.symbol.toLowerCase() === wallet);
      setSelectedWallet(selected);
    }
  }, [wallets, wallet]);

  // const reloadTimeout = () =>
  //   setTimeout(() => {
  //     update();
  //   }, 4000);

  const successToast = async (amount: number, order: string) => {
    const toast = document.createElement("ion-toast");
    toast.message = `You ${amount} USD ${order} order was successfully placed`;
    toast.duration = 4000;

    document.body.appendChild(toast);
    update();
    return toast.present();
  };
  const handleSubmit = () => {
    if (main < 100) {
      setShowToast(true);
    } else {
      axiosInstance
        .post("users/add-trades/", {
          portfolio: profile?.id,
          wallet: selectedWallet?.id,
          type: order,
          amount: main,
          duration: duration,
          completed: false,
        })
        .then((res) => {
          setMainValue("0");
          history.push("/tx/wallet/" + wallet);
          successToast(res.data.amount, res.data.type);
        })
        .catch((err) => {
          // console.log(err);
        });
    }
  };

  return (
    <IonPage>
      <IonContent className="BuySell ion-padding">
        {/* refresher */}
        <Refresher />
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/home")}
        />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Minimum order amount is 100 USD"
          duration={2000}
        />
        <IonText>
          <h1>
            {mainValue}
            <p>USD</p>
          </h1>
        </IonText>
        <div className="max">
          <div className="balance" onClick={() => setMainValue(maxValue!)}>
            <p className="wallet">
              MAX <span>{maxValue} USD</span>
            </p>
          </div>
        </div>
        <IonSelect
          value={duration}
          placeholder="Change market window"
          onIonChange={(e) => setDuration(e.detail.value)}
        >
          <IonSelectOption value={7}>1 Week</IonSelectOption>
          <IonSelectOption value={14}>2 Weeks</IonSelectOption>
          <IonSelectOption value={21}>3 Weeks</IonSelectOption>
          <IonSelectOption value={30}>1 Month</IonSelectOption>
          <IonSelectOption value={60}>2 Months</IonSelectOption>
        </IonSelect>
        <NumberInput handleInput={handleInput} />
        {!profile ? (
          <IonButton expand="block">
            <p>Loading...</p>
          </IonButton>
        ) : (
          <IonButton
            color={orderTheme()}
            disabled={valid ? false : true}
            onClick={handleSubmit}
            expand="block"
          >
            {valid ? (
              order === "buy" ? (
                <p>Place buy order</p>
              ) : order === "sell" ? (
                <p>Place sell order</p>
              ) : (
                <p>Copy trade</p>
              )
            ) : (
              <p>Insufficient Funds</p>
            )}
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BuySell;
