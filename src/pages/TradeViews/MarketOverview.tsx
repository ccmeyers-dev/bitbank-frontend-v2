import React, { useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/MarketOverview.scss";
import {
  MarketOverviewWidgetScript,
  MarketOverviewWidget,
} from "../Widgets/MarketOverviewWidget";

const MarketOverview: React.FC = () => {
  const { goBack } = useContext(NavContext);

  const themeMode = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  useEffect(() => {
    // console.log("starting overview...");

    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.src = MarketOverviewWidgetScript;

    scriptConfig.async = true;

    scriptConfig.innerHTML = MarketOverviewWidget(themeMode);

    document.getElementById("window")?.appendChild(scriptConfig);

    return () => {
      // console.log("removing overview...");
    };
  }, [themeMode]);

  return (
    <IonPage>
      <IonContent className="MarketOverview">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/home")}
        />
        <IonListHeader lines="none">
          <h1>Market Overview</h1>
        </IonListHeader>

        <div className="content">
          <div id="window" className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default MarketOverview;
