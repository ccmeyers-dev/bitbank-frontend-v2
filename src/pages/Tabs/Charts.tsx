import React, { useEffect, useState } from "react";
import { IonContent, IonPage, IonSelect, IonSelectOption } from "@ionic/react";

// styles
import "./styles/Charts.scss";

// utils
import Refresher from "../../components/utils/Refresher";

const Charts: React.FC = () => {
  const [symbol, setSymbol] = useState("BITSTAMP:BTCUSD");

  const themeMode = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  useEffect(() => {
    // console.log("starting...");

    const scriptConfig = document.createElement("script");

    scriptConfig.innerHTML = `
    new TradingView.widget({
      "autosize": true,
      "symbol": "${symbol}",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "${themeMode}",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "candlesticks",
    })`;

    document.getElementById("market-window")?.appendChild(scriptConfig);

    const screenerScriptConfig = document.createElement("script");
    screenerScriptConfig.type = "text/javascript";
    screenerScriptConfig.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    screenerScriptConfig.async = true;

    screenerScriptConfig.innerHTML = `
    {
      "width": "100%",
      "height": "100%",
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "colorTheme": "${themeMode}",
      "locale": "en"
    }
    `;

    document
      .getElementById("screener-window")
      ?.appendChild(screenerScriptConfig);

    return () => {
      // console.log("removing...", scriptConfig);
      document.getElementById("market-window")?.removeChild(scriptConfig);
      document
        .getElementById("screener-window")
        ?.removeChild(screenerScriptConfig);
    };
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
