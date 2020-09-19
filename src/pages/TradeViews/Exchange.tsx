import React, { useEffect, useContext, useState } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonAvatar,
  IonFooter,
  NavContext,
} from "@ionic/react";
import "./styles/Exchange.scss";
import { arrowBack } from "ionicons/icons";
import { useParams } from "react-router";
import Refresher from "../../components/utils/Refresher";
import { useProfile } from "../../Context/ProfileContext";
import { useWallets } from "../../Context/WalletContext";
import { useCoinValue } from "../../Context/Hooks/CoinValueHook";

const Exchange: React.FC = () => {
  const [wallet, setWallet] = useState<any>({});

  const { wallets } = useWallets();

  const { goBack } = useContext(NavContext);

  const { exchange } = useParams();
  const market = exchange.toUpperCase();

  const {
    profile,
    loading: loadingProfile,
    error: errorProfile,
  } = useProfile();

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
  const walletBalance = loadingProfile
    ? "0.00"
    : errorProfile
    ? "0.00"
    : available()!.toFixed(2);

  const themeMode = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  useEffect(() => {
    const result = wallets.find((w) => w.symbol === market.toUpperCase());
    if (result !== undefined) {
      setWallet(result);
    }

    // console.log(`starting exchange at BITBAY:BTC${market}|12m...`);

    const scriptConfig = document.createElement("script");

    scriptConfig.innerHTML = `
    new TradingView.MediumWidget({
      symbols: [
        [
          "BITBAY:${market}USD|12m"
        ],
    
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "${themeMode}",
      gridLineColor: "#F0F3FA",
      trendLineColor: "#2196F3",
      fontColor: "#787B86",
      underLineColor: "#E3F2FD",
      isTransparent: false,
      autosize: true,
      container_id: "ticker",
    })`;

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
                <IonAvatar>
                  <img src={`${wallet.wallet}.png`} alt="" />
                </IonAvatar>
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
