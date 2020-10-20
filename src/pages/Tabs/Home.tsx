import React, { useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonList,
  IonLabel,
  IonItem,
  IonListHeader,
  IonText,
  IonBadge,
  IonIcon,
  IonSlides,
  IonSlide,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonRouterLink,
} from "@ionic/react";
import { checkmarkDoneCircle } from "ionicons/icons";
import "./styles/Home.scss";
import Refresher from "../../components/utils/Refresher";
import { ExchangeItemProp } from "../../Interfaces/ExchangeItem";

//mock data

import { toCurrency } from "../../components/utils/Utils";
import { useExchange } from "../../Hooks/ExchangeHook";
import { config } from "../../app.config";
import { useProfile } from "../../Hooks/ProfileHook";
import { DummyWallets } from "../../MockData/wallets";
import { useHistory } from "react-router";

const ExchangeItem: React.FC<ExchangeItemProp> = ({ wallet, symbol }) => {
  const { usd, usd_24h_change } = useExchange(symbol);

  const change = usd_24h_change ?? 0;

  return (
    <IonItem
      routerLink={`/tx/exchange/${symbol.toLowerCase()}`}
      className="ion-no-padding"
      detail
    >
      <IonIcon src={`coins/${wallet}.svg`} />

      <IonLabel className="coin-label">
        <IonText>
          <h3>{wallet}</h3>
          <p>{symbol}</p>
        </IonText>
      </IonLabel>
      <IonLabel className="ion-text-end coin-price" slot="end">
        <IonText>
          <p>${toCurrency(usd, symbol)}</p>
          <IonBadge class={change > 0 ? "high" : "low"}>
            {change > 0 && "+"}
            {change.toFixed(2)}
          </IonBadge>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};
const Home: React.FC = () => {
  const { data: profile, error } = useProfile();
  // const { data: wallets } = useWallets();

  const wallets = DummyWallets;
  const history = useHistory();

  useEffect(() => {
    if (profile) {
      if (!profile.profile) {
        // console.log("tabs say not verified");
        history.replace({
          pathname: "/verify/profile",
          state: {
            from: "app",
          },
        });
      }
    }
  }, [profile, history]);

  return (
    <IonPage>
      <IonContent className="ion-padding Home">
        <Refresher />

        <IonText className="quick-balance">
          <h2 id="greeting">Home</h2>
          <p className="cash-value" data-username={profile?.full_name}>
            Total cash value
          </p>
          <h1>
            {toCurrency(profile?.current)} USD
            {profile?.current! < profile?.total! && (
              <IonSpinner name="lines" color="primary" />
            )}
          </h1>
        </IonText>
        <IonList mode="ios" className="shortcuts">
          <IonItem routerLink="/tx/overview" className="ion-no-padding" detail>
            <IonLabel>
              <h2>Market Overview</h2>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/help" className="ion-no-padding" detail>
            <IonLabel>
              <h2>Buy Crypto</h2>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/withdraw" className="ion-no-padding" detail>
            <IonLabel>
              <h2>Withdraw</h2>
            </IonLabel>
          </IonItem>
        </IonList>
        {profile?.pending_notifications > 0 && (
          <div className="notification">
            <p>
              You have {profile.pending_notifications} pending notification
              {profile.pending_notifications > 1 && "s"}{" "}
              <IonRouterLink routerLink="/tx/notifications">
                <span>click here</span>
              </IonRouterLink>
            </p>
          </div>
        )}
        {profile?.total! <= 0 && (
          <div className="welcome-message">
            <div className="icon-cover">
              <IonIcon icon={checkmarkDoneCircle} />
            </div>
            <IonText>
              <h5>Finish Signing Up. Buy Crypto.</h5>
              <p>
                You're almost done signing up for your {config.short_name}{" "}
                Wallet. Once you finish and get approved, stat buying crypto.
              </p>
            </IonText>
            <IonButton routerLink="/tx/help" mode="ios" expand="block">
              Continue
            </IonButton>
          </div>
        )}
        <div>
          <IonSlides pager={true}>
            {wallets &&
              wallets.map(({ wallet, symbol, id }) => (
                <IonSlide key={id} className="slide-item">
                  <IonCard>
                    <IonCardContent>
                      <IonItem
                        routerLink={`/tx/wallet/${symbol.toLowerCase()}`}
                        lines="full"
                      >
                        <div className="icon">
                          <IonIcon src={`coins/${wallet}.svg`} />
                        </div>
                        <IonText>
                          <h3>{wallet} wallet</h3>
                          <p>
                            Trade, withdraw, and deposit from your{" "}
                            {wallet.toLowerCase()} wallet today
                          </p>
                        </IonText>
                      </IonItem>
                      <IonRouterLink
                        routerLink={`/tx/withdraw/${symbol.toLowerCase()}`}
                      >
                        <p>Withdraw {symbol}</p>
                      </IonRouterLink>
                    </IonCardContent>
                  </IonCard>
                </IonSlide>
              ))}
          </IonSlides>
        </div>
        <IonListHeader>
          <IonLabel>
            <p>Exchange Rates</p>
          </IonLabel>
          <IonBadge color="light">1D</IonBadge>
        </IonListHeader>
        <IonList className="exchanges" lines="none">
          {wallets &&
            wallets.map(({ wallet, symbol, id }) => (
              <ExchangeItem key={id} wallet={wallet} symbol={symbol} />
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
