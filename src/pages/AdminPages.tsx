import React, { useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { IonPage, IonRouterOutlet } from "@ionic/react";

import Dashboard from "./Admin/Dashboard";
import WalletAddress from "./Admin/WalletAddress";
import Withdrawal from "./Admin/Withdrawal";
import Deposit from "./Admin/Deposit";
import Profile from "./Admin/Profile";
import Trade from "./Admin/Trade";
import ExpertTrader from "./Admin/ExpertTrader";
import Notification from "./Admin/Notification";
import Credentials from "./Admin/Credentials";
import { useProfile } from "../Hooks/ProfileHook";
import FullSpinner from "../components/FullSpinner";

const AdminPages: React.FC = () => {
  const { data: profile } = useProfile();
  const history = useHistory();

  useEffect(() => {
    if (profile) {
      if (!profile.account.is_admin) {
        console.log("admin pages say not admin");
        history.replace("/en/home");
      }
    }
  }, [profile, history]);

  return (
    <IonPage>
      {profile ? (
        <IonRouterOutlet>
          <Route path="/sudo/dashboard" component={Dashboard} />
          <Route path="/sudo/wallets" component={WalletAddress} />
          <Route path="/sudo/profile/:id" component={Profile} />
          <Route path="/sudo/credentials/:id" component={Credentials} />
          <Route path="/sudo/trades/:id" component={Trade} />
          <Route path="/sudo/deposits/:id" component={Deposit} />
          <Route path="/sudo/withdrawals/:id" component={Withdrawal} />
          <Route path="/sudo/notifications/:id" component={Notification} />
          <Route path="/sudo/expert-trader/:id" component={ExpertTrader} />

          <Route
            path="/sudo"
            render={() => <Redirect to="/sudo/dashboard" />}
            exact={true}
          />
        </IonRouterOutlet>
      ) : (
        <FullSpinner />
      )}
    </IonPage>
  );
};

export default AdminPages;
