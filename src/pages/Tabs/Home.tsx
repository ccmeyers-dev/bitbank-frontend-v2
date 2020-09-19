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
  IonAvatar,
  IonBadge,
  IonIcon,
  IonSlides,
  IonSlide,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonRouterLink,
  IonLoading,
} from "@ionic/react";
import { checkmarkDoneCircle, closeOutline } from "ionicons/icons";
import "./styles/Home.scss";
import Refresher from "../../components/utils/Refresher";
import { ExchangeItemProp } from "../../Interfaces/ExchangeItem";

//mock data

import { useProfile } from "../../Context/ProfileContext";
import { toCurrency } from "../../components/utils/Utils";
import { useWallets } from "../../Context/WalletContext";
import ErrorPage from "../../components/ErrorPage";
import { useExchange } from "../../Context/Hooks/ExchangeHook";
import { config } from "../../app.config";

const ExchangeItem: React.FC<ExchangeItemProp> = ({ wallet, symbol }) => {
  const { usd, usd_24h_change } = useExchange(symbol);

  return (
    <IonItem
      routerLink={`/tx/exchange/${symbol.toLowerCase()}`}
      className="ion-no-padding"
      detail
    >
      <IonAvatar slot="start">
        <img src={`${wallet}.png`} alt="" />
      </IonAvatar>
      <IonLabel className="coin-label">
        <IonText>
          <h3>{wallet}</h3>
          <p>{symbol}</p>
        </IonText>
      </IonLabel>
      <IonLabel className="ion-text-end coin-price" slot="end">
        <IonText>
          <p>${toCurrency(usd, symbol)}</p>
          {usd_24h_change > 0 ? (
            <IonBadge class="high">+{usd_24h_change.toFixed(2)}</IonBadge>
          ) : (
            <IonBadge class="low">{usd_24h_change.toFixed(2)}</IonBadge>
          )}
        </IonText>
      </IonLabel>
    </IonItem>
  );
};
const Home: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const { wallets } = useWallets();

  useEffect(() => {
    const swapText = setInterval(() => {
      const greeting = document.getElementById("greeting");
      if (greeting) {
        if (greeting.innerText === "Home") {
          greeting.innerText = `${profile?.full_name}`;
        } else {
          greeting.innerText = "Home";
        }
      }
    }, 4000);
    return () => {
      clearInterval(swapText);
    };
  }, [profile, loading]);

  return (
    <IonPage>
      <IonContent className="ion-padding Home">
        <Refresher />

        {loading ? (
          <IonLoading
            cssClass="my-custom-loading"
            isOpen={true}
            message={"Please wait..."}
            duration={5000}
          />
        ) : error ? (
          <ErrorPage />
        ) : (
          <>
            <IonText className="quick-balance">
              <h2 id="greeting">Home</h2>
              <p>Total cash value</p>
              <h1>
                {toCurrency(profile?.current)} USD
                {profile?.current! < profile?.total! && (
                  <IonSpinner name="lines" color="primary" />
                )}
              </h1>
            </IonText>

            <IonList mode="ios" className="shortcuts">
              <IonItem
                routerLink="/tx/overview"
                className="ion-no-padding"
                detail
              >
                <IonLabel>
                  <h2>Market Overview</h2>
                </IonLabel>
              </IonItem>
              <IonItem routerLink="/tx/help" className="ion-no-padding" detail>
                <IonLabel>
                  <h2>Buy Crypto</h2>
                </IonLabel>
              </IonItem>
              <IonItem
                routerLink="/tx/withdraw"
                className="ion-no-padding"
                detail
              >
                <IonLabel>
                  <h2>Withdraw</h2>
                </IonLabel>
              </IonItem>
            </IonList>
            {profile?.total! <= 0 && (
              <div className="welcome-message">
                <div className="icon-cover">
                  <IonIcon icon={checkmarkDoneCircle} />
                </div>
                <IonText>
                  <h5>Finish Signing Up. Buy Crypto.</h5>
                  <p>
                    You're almost done signing up for your {config.short_name}{" "}
                    Wallet. Once you finish and get approved, stat buying
                    crypto.
                  </p>
                </IonText>
                <IonButton routerLink="/tx/help" mode="ios" expand="block">
                  Continue
                </IonButton>
              </div>
            )}

            <div>
              <IonSlides pager={true}>
                {wallets.map(({ wallet, symbol, id }) => (
                  <IonSlide key={id} className="slide-item">
                    <IonCard>
                      <IonIcon icon={closeOutline} />
                      <IonCardContent>
                        <IonItem
                          routerLink={`/tx/wallet/${symbol.toLowerCase()}`}
                          lines="full"
                        >
                          <IonAvatar>
                            <img src={`${wallet}.png`} alt="" />
                          </IonAvatar>
                          <IonText>
                            <h3>{wallet} wallet</h3>
                            <p>
                              Trade, withdraw, and deposit from your{" "}
                              {wallet.toLowerCase()} today
                            </p>
                          </IonText>
                        </IonItem>
                        <IonRouterLink routerLink="/tx/withdraw/">
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
              {wallets.map(({ wallet, symbol, id }) => (
                <ExchangeItem key={id} wallet={wallet} symbol={symbol} />
              ))}
            </IonList>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
