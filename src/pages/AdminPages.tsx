import React from "react";
import { Route, Redirect } from "react-router-dom";
import { IonPage, IonRouterOutlet } from "@ionic/react";

import Dashboard from "./Admin/Dashboard";
import WalletAddress from "./Admin/WalletAddress";
import Withdrawal from "./Admin/Withdrawal";
import Deposit from "./Admin/Deposit";
import Profile from "./Admin/Profile";
import Trade from "./Admin/Trade";
import ExpertTrader from "./Admin/ExpertTrader";

const AdminPages: React.FC = () => (
  <IonPage>
    <IonRouterOutlet>
      {/* test routes */}
      <Route path="/sudo/dashboard" component={Dashboard} />
      <Route path="/sudo/wallets" component={WalletAddress} />
      <Route path="/sudo/profile/:id" component={Profile} />
      <Route path="/sudo/trades/:id" component={Trade} />
      <Route path="/sudo/deposits/:id" component={Deposit} />
      <Route path="/sudo/withdrawals/:id" component={Withdrawal} />
      <Route path="/sudo/expert-trader/:id" component={ExpertTrader} />

      <Route
        path="/sudo"
        render={() => <Redirect to="/sudo/dashboard" />}
        exact={true}
      />
    </IonRouterOutlet>
  </IonPage>
);

export default AdminPages;
