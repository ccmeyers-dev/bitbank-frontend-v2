import React from "react";
import {
  IonIcon,
  IonSlides,
  IonSlide,
  IonButton,
  IonRouterLink,
} from "@ionic/react";
import "./styles/HomePage.scss";
import {
  logoBitcoin,
  chevronBack,
  cashOutline,
  sendOutline,
} from "ionicons/icons";

import { config } from "../../app.config";

const SlideItem = ({ title, body }: { title: string; body: string }) => {
  return (
    <IonSlide>
      <div className="page">
        <h3>{title}</h3>
        <h1>{body}</h1>
      </div>
    </IonSlide>
  );
};

const More: React.FC = () => {
  return (
    <div className="more">
      <IonRouterLink routerLink="/home" routerDirection="root">
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
      </IonRouterLink>

      <IonSlides options={{ slidesPerPage: 1 }} pager={true}>
        <SlideItem title={`${config.short_name} customers`} body="5 million+" />
        <SlideItem title="We've processed over" body="$14 billion" />
        <SlideItem title="Available in over" body="40 countries" />
      </IonSlides>
      <div className="content">
        <div className="intro">
          <h1>
            Why are so many people buying cryptocurrencies like{" "}
            <span>Bitcoin?</span>
          </h1>
          <IonSlides options={{ slidesPerPage: 1 }} pager={true}>
            <IonSlide>
              <div className="info investment">
                <IonIcon icon={logoBitcoin} />
                <h3>It's a new type of investment</h3>
                <p>
                  People are buying Bitcoin because it is like digital gold. It
                  is used as an alternative store of wealth, for portfolio
                  diversification, passive income and a long term investment
                </p>
              </div>
            </IonSlide>
            <IonSlide>
              <div className="info freedom">
                <IonIcon icon={cashOutline} />
                <h3>It's true financial freedom</h3>
                <p>
                  Like the internet, no single entity controls Bitcoin. It
                  provides users with both transparency and privacy. It puts you
                  back in control of your money
                </p>
              </div>
            </IonSlide>
            <IonSlide>
              <div className="info move">
                <IonIcon icon={sendOutline} />
                <h3>It's a better way to move money</h3>
                <p>
                  People all over the world use Bitcoin to send money to friends
                  and family or buy things online. It can be cheaper, faster and
                  easier to use than ordinary money
                </p>
              </div>
            </IonSlide>
          </IonSlides>
        </div>
        <div className="header">
          <h3>
            {config.short_name} supplies the platform for you to buy and sell
            Bitcoin, Ethereum, Litecoin and XRP in <span>three easy steps</span>
          </h3>
        </div>
        <div className="steps">
          <div className="item">
            <div className="title">
              <h1>1. Sign up</h1>
            </div>
            <div className="body">
              Sign up for a free {config.short_name} account and follow our easy
              process to set up your profile.
            </div>
          </div>

          <div className="item">
            <div className="title">
              <h1>2. Deposit crypto</h1>
            </div>
            <div className="body">
              Choose your preferred deposit method like cryptocurrency transfer
              or buy directly from payment merchants like coinmama.com to add
              funds to your {config.short_name} wallets.
            </div>
          </div>

          <div className="item">
            <div className="title">
              <h1>3. Trade crypto</h1>
            </div>
            <div className="body">
              Place buy or sell orders directly from your dashboard.{" "}
              {config.short_name} allows traders to copy trade from expert
              traders. Enjoy trading.
            </div>
          </div>
        </div>
        <IonRouterLink routerLink="/home" routerDirection="root">
          <div className="back">
            <IonButton mode="ios" expand="block">
              Go home
            </IonButton>
          </div>
        </IonRouterLink>
      </div>
    </div>
  );
};

export default More;
