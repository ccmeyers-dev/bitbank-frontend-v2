import React, { useEffect } from "react";
import { IonButton, IonIcon, IonRouterLink } from "@ionic/react";
import "./styles/HomePage.scss";
import { checkmarkCircle, menu } from "ionicons/icons";
import { config } from "../../app.config";
import usePlainRequest from "../../Hooks/PlainRequest";
import {
  HomePageTicker,
  HomePageTickerScript,
} from "../Widgets/HomePageTicker";

const Home: React.FC = () => {
  const visited = localStorage.getItem("visited");
  const hasToken = localStorage.getItem("refresh_token");

  const { data } = usePlainRequest("https://ipapi.co/country_name/");

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
      <div className="head">
        <h1>{config.name}</h1>
        <IonRouterLink routerLink="/home/more">
          <IonIcon icon={menu} />
        </IonRouterLink>
      </div>

      <div className="content">
        <div id="ticker" className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      <h3>Trade Bitcoin, Ethereum, Litecoin and XRP {data && `in ${data}`}</h3>

      <div className="start">
        {hasToken ? (
          <IonButton
            routerLink="/en/home"
            mode="ios"
            expand="block"
            className="visited"
          >
            <p>START TRADING</p>
          </IonButton>
        ) : (
          <IonButton
            routerLink={visited ? "/auth/login" : "/auth/register"}
            mode="ios"
            expand="block"
          >
            <p>GET STARTED</p>
          </IonButton>
        )}
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
      <div className="next">
        <IonButton
          routerLink="/home/more"
          routerDirection="root"
          mode="ios"
          expand="block"
        >
          <p>Learn more</p>
        </IonButton>
      </div>
    </div>
  );
};

export default Home;
