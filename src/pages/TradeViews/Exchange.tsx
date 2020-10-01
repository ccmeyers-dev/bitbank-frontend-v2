import React, { useEffect, useContext, useState } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonFooter,
  NavContext,
} from "@ionic/react";
import "./styles/Exchange.scss";
import { arrowBack } from "ionicons/icons";
import { useParams } from "react-router";
import Refresher from "../../components/utils/Refresher";
import { useCoinValue } from "../../Hooks/CoinValueHook";
import { useWallets } from "../../Hooks/WalletsHook";
import { ExchangeWidget } from "../Widgets/ExchangeWidget";
import { useProfile } from "../../Hooks/ProfileHook";

const Exchange: React.FC = () => {
  const [wallet, setWallet] = useState<any>({});

  const { data: wallets } = useWallets();

  const { goBack } = useContext(NavContext);

  const { exchange } = useParams();
  const market = exchange.toUpperCase();

  const { data: profile } = useProfile();

  const available = () => {
    switch (exchange) {
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
  const walletBalance = !profile ? "0.00" : available()!.toFixed(2);

  const themeMode = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  useEffect(() => {
    if (wallets) {
      const result = wallets.find((w) => w.symbol === market.toUpperCase());
      if (result) {
        setWallet(result);
      }
    }

    // console.log(`starting exchange at BITBAY:BTC${market}|12m...`);

    const scriptConfig = document.createElement("script");

    scriptConfig.innerHTML = ExchangeWidget(market, themeMode);

    document.getElementById("chart")?.appendChild(scriptConfig);

    return () => {
      // console.log("removing exchange...");
    };
  }, [market, themeMode, wallets]);

  return (
    <IonPage className="Exchange">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack("/en/home")}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Exchange {market}USD</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* refresher */}
        <Refresher />

        <div id="chart" className="chart">
          <div id="ticker"></div>
        </div>
        <div className="copy-trade">
          <h2>Other ways to trade</h2>
          <div className="summary">
            <p>
              New to trading? <br /> copy signals from expert traders in one
              click.
            </p>
            <IonButton routerLink={`/tx/copy-trade/${exchange}`} mode="ios">
              <p>Copy Trade</p>
            </IonButton>
          </div>
        </div>

        <IonFooter>
          <div className="footer">
            <div className="balance">
              <div className="coin">
                <IonIcon src={`coins/${wallet.wallet}.svg`} />
                <p>{market} Wallet</p>
              </div>
              <div className="amount">
                <p className="main">{walletBalance} USD</p>
                <p className="sub">
                  {useCoinValue(wallet.symbol, parseFloat(walletBalance))}{" "}
                  {wallet.symbol}
                </p>
              </div>
            </div>
            <div className="buy-sell">
              <IonButton
                color="success"
                routerLink={`/tx/order/${exchange}/buy`}
                mode="ios"
              >
                <p>Buy</p>
              </IonButton>
              <IonButton
                color="danger"
                routerLink={`/tx/order/${exchange}/sell`}
                mode="ios"
              >
                <p>Sell</p>
              </IonButton>
            </div>
          </div>
        </IonFooter>
      </IonContent>
    </IonPage>
  );
};

export default Exchange;
