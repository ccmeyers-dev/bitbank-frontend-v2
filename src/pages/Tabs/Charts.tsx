import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonSelect, IonSelectOption } from "@ionic/react";

// styles
import "./styles/Charts.scss";

// utils
import Refresher from "../../components/utils/Refresher";
import { TradingViewChart } from "../Widgets/TradingViewChart";
import {
  ScreenerWidget,
  ScreenerWidgetScript,
} from "../Widgets/ScreenerWidget";
import { tradingViewId } from "../../App";

const Charts: React.FC = () => {
  const [symbol, setSymbol] = useState("BITSTAMP:BTCUSD");

  const themeMode = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  useEffect(() => {
    // console.log("starting...");
    const tradingViewReady = localStorage.getItem(tradingViewId) === "true";

    const scriptConfig = document.createElement("script");

    scriptConfig.innerHTML = TradingViewChart(symbol, themeMode);

    const screenerScriptConfig = document.createElement("script");
    screenerScriptConfig.type = "text/javascript";
    screenerScriptConfig.src = ScreenerWidgetScript;
    screenerScriptConfig.innerHTML = ScreenerWidget(themeMode);
    screenerScriptConfig.async = true;

    const loadWidget = () => {
      document.getElementById("market-window")?.appendChild(scriptConfig);
      document
        .getElementById("screener-window")
        ?.appendChild(screenerScriptConfig);
    };

    if (tradingViewReady) {
      loadWidget();
    }
  }, [symbol, themeMode]);

  return (
    <IonPage className="Charts">
      <IonContent>
        {/* refresher */}
        <Refresher />
        <IonSelect
          value={symbol}
          placeholder="Change market window"
          onIonChange={(e) => setSymbol(e.detail.value)}
        >
          <IonSelectOption value="BITSTAMP:BTCUSD">
            Bitcoin / US Dollar Market
          </IonSelectOption>
          <IonSelectOption value="BITSTAMP:ETHUSD">
            Ethereum / US Dollar Market
          </IonSelectOption>
          <IonSelectOption value="BITSTAMP:LTCUSD">
            Litecoin / US Dollar Market
          </IonSelectOption>
          <IonSelectOption value="BITSTAMP:XRPUSD">
            XRP / US Dollar Market
          </IonSelectOption>
        </IonSelect>
        <div id="market-window">
          <div id="candlesticks"></div>
        </div>
        <div className="mid-section">
          <p>Market data provided by TradingView &copy;</p>
        </div>
        <div id="screener-window" className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Charts;
