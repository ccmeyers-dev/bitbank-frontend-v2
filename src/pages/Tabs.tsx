import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from "@ionic/react";
import {
  homeSharp,
  wallet,
  settingsSharp,
  newspaper,
  flash,
} from "ionicons/icons";

// styles
import "../theme/TabBar.scss";

// Route components
import Home from "./Tabs/Home";
import Wallets from "./Tabs/Wallets";
import Charts from "./Tabs/Charts";
import Settings from "./Tabs/Settings";
import TransactionHistory from "./Tabs/TransactionHistory";

const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/en/home" component={Home} />
      <Route path="/en/wallets" component={Wallets} />
      <Route path="/en/charts" component={Charts} />
      <Route path="/en/transaction-history" component={TransactionHistory} />
      <Route path="/en/settings" component={Settings} />
      <Route path="/en" render={() => <Redirect to="/en/home" />} exact />
    </IonRouterOutlet>
    <IonTabBar className="tabs" slot="bottom">
      <IonTabButton tab="Home" href="/en/home">
        <IonIcon icon={homeSharp} />
      </IonTabButton>
      <IonTabButton tab="Wallets" href="/en/wallets">
        <IonIcon icon={wallet} />
      </IonTabButton>
      <IonTabButton tab="Charts" href="/en/charts">
        <IonIcon icon={flash} />
      </IonTabButton>
      <IonTabButton tab="TransactionHistory" href="/en/transaction-history">
        <IonIcon icon={newspaper} />
      </IonTabButton>
      <IonTabButton tab="Settings" href="/en/settings">
        <IonIcon icon={settingsSharp} />
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
