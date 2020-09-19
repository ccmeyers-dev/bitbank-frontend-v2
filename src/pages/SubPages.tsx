import React from "react";
import { Route, Redirect } from "react-router-dom";
import { IonPage, IonRouterOutlet } from "@ionic/react";

import ThemeSelector from "./Settings/ThemeSelector";
import BuySell from "./TradeViews/BuySell";
import Wallet from "./TradeViews/Wallet";
import Exchange from "./TradeViews/Exchange";
import Withdraw from "./TradeViews/Withdraw";
import CopyTrade from "./TradeViews/CopyTrade";
import About from "./Settings/SubSettings/About";
import AccountLevel from "./Settings/SubSettings/AccountLevel";
import AddressBook from "./Settings/SubSettings/AddressBook";
import Help from "./Settings/SubSettings/Help";
import PrivacyPolicy from "./Settings/SubSettings/PrivacyPolicy";
import Terms from "./Settings/SubSettings/Terms";
import MarketOverview from "./TradeViews/MarketOverview";
import UserProfile from "./Settings/UserProfile";

const SubPages: React.FC = () => (
  <IonPage>
    <IonRouterOutlet>
      {/* settings routes */}
      <Route path="/tx/theme" component={ThemeSelector} />
      <Route path="/tx/profile" component={UserProfile} />
      {/* sub settings routes */}
      <Route path="/tx/address-book" component={AddressBook} />
      <Route path="/tx/account-level" component={AccountLevel} />
      <Route path="/tx/about" component={About} />
      <Route path="/tx/help" component={Help} />
      <Route path="/tx/privacy-policy" component={PrivacyPolicy} />
      <Route path="/tx/terms" component={Terms} />
      {/* trade-view routes */}
      <Route path="/tx/order/:wallet/:order" component={BuySell} />
      <Route path="/tx/exchange/:exchange" component={Exchange} />
      <Route path="/tx/wallet/:symbol" component={Wallet} />
      <Route path="/tx/withdraw" component={Withdraw} />
      <Route path="/tx/copy-trade/:wallet" component={CopyTrade} />
      <Route path="/tx/overview" component={MarketOverview} />

      <Route render={() => <Redirect to="/en" />} exact={true} />
    </IonRouterOutlet>
  </IonPage>
);

export default SubPages;
