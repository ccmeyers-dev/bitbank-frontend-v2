import React, { useEffect } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import "./styles/HomePage.scss";
import { checkmarkCircle } from "ionicons/icons";
import { config } from "../../app.config";
import {
  HomePageTicker,
  HomePageTickerScript,
} from "../Widgets/HomePageTicker";

const Home: React.FC = () => {
  const visited = localStorage.getItem("visited");
  const hasToken = localStorage.getItem("refresh_token");

  useEffect(() => {
    // console.log("starting ticker...");

    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.async = true;
    scriptConfig.src = HomePageTickerScript;
    scriptConfig.innerHTML = HomePageTicker;

    document.getElementById("ticker")?.appendChild(scriptConfig);

    return () => {
      // console.log("removing ticker...");
    };
  }, [hasToken]);

  return (
    <div className="home">
      <div className="image_bg"></div>
      <div className="head">
        <h1>{config.name}</h1>
        <IonButton
          routerLink="/auth/register"
          mode="ios"
          size="small"
          fill="outline"
          className="register"
        >
          <p>Register</p>
        </IonButton>
      </div>

      <div className="content">
        <div id="ticker" className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      <h3>Trade and Invest in Bitcoin, Ethereum, Litecoin and XRP</h3>

      <div className="start">
        <IonButton routerLink="/home/more" mode="ios" className="learn">
          <p>Learn More</p>
        </IonButton>
        <IonButton
          routerLink={visited ? "/auth/login" : "/auth/register"}
          mode="ios"
          className="start"
        >
          <p>Get Started</p>
        </IonButton>
      </div>
      <div className="list">
        <div className="entry">
          <IonIcon icon={checkmarkCircle} />
          <p>
            Easily <b>buy & sell</b> different cryptocurrencies
          </p>
        </div>
        <div className="entry">
          <IonIcon icon={checkmarkCircle} />
          <p>
            <b>Learn more</b> about cryptocurrencies
          </p>
        </div>
        <div className="entry">
          <IonIcon icon={checkmarkCircle} />
          <p>
            Advanced <b>charts</b> and real-time <b>market data</b>
          </p>
        </div>
        <div className="entry">
          <IonIcon icon={checkmarkCircle} />
          <p>
            Start trading quickly by <b>copy trading</b> signals from{" "}
            <b>expert traders</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
