import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonSlides,
  IonSlide,
} from "@ionic/react";
import "./styles/HomePage.scss";
import {
  checkmarkCircle,
  logoBitcoin,
  chevronBack,
  cashOutline,
  sendOutline,
} from "ionicons/icons";

import axios from "axios";
import Refresher from "../../components/utils/Refresher";
import { useProfile } from "../../Context/ProfileContext";
import { Redirect } from "react-router";
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

interface Prop {
  toggle: () => void;
}

const More: React.FC<Prop> = ({ toggle }) => {
  return (
    <div className="more">
      <div onClick={() => toggle()} className="head">
        <h1>{config.name}</h1>
        <IonIcon icon={chevronBack} />
      </div>
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
        <div onClick={() => toggle()} className="back">
          <IonButton mode="ios" expand="block">
            Go home
          </IonButton>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<Prop> = ({ toggle }) => {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const visited = localStorage.getItem("visited");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://ip-api.com/json")
      .then((res) => {
        setCountry(res.data.country);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setCountry("any Country");
        setLoading(false);
      });

    // console.log("starting ticker...");

    const scriptConfig = document.createElement("script");
    scriptConfig.type = "text/javascript";
    scriptConfig.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    scriptConfig.async = true;

    scriptConfig.innerHTML = `
    {
      "symbols": [
        {
          "proName": "BITSTAMP:BTCUSD",
          "title": "BTC/USD"
        },
        {
          "proName": "BITSTAMP:ETHUSD",
          "title": "ETH/USD"
        },
        {
          "description": "LTC/USD",
          "proName": "BITSTAMP:LTCUSD"
        },
        {
          "description": "XRP/USD",
          "proName": "BITSTAMP:XRPUSD"
        },
        {
          "description": "BTC/EUR",
          "proName": "BITSTAMP:BTCEUR"
        },
        {
          "description": "ETH/EUR",
          "proName": "BITSTAMP:ETHEUR"
        },
        {
          "description": "LTC/EUR",
          "proName": "BITSTAMP:LTCEUR"
        },
        {
          "description": "XRP/EUR",
          "proName": "BITSTAMP:XRPEUR"
        }
      ],
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    }
    `;

    document.getElementById("ticker")?.appendChild(scriptConfig);

    return () => {
      // console.log("removing ticker...");
    };
  }, []);

  return (
    <div className="home">
      <div className="head">
        <h1>{config.name}</h1>
      </div>

      <div className="content">
        <div id="ticker" className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      <h3>
        Trade Bitcoin, Ethereum, Litecoin and XRP in{" "}
        {loading ? "any Country" : country}
      </h3>
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
      <div onClick={() => toggle()} className="next">
        <p>LEARN MORE</p>
      </div>
      <div className="start">
        <IonButton
          routerLink={visited ? "/auth/login" : "/auth/register"}
          mode="ios"
          expand="block"
        >
          GET STARTED
        </IonButton>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const toggleShow = () => {
    setShowMore(!showMore);
  };

  const { profile } = useProfile();

  useEffect(() => {
    // console.log("Profile from home: ", profile);
    console.log("Visited: ", localStorage.getItem("visited"));
    if (profile?.id) {
      console.log("Logged in");
    } else {
      console.log("Not authenticated");
    }
  }, [profile]);

  if (profile?.id) {
    return <Redirect to="/en/home" />;
  }

  return (
    <IonPage>
      <IonContent className="HomePage">
        <Refresher />
        {showMore ? <More toggle={toggleShow} /> : <Home toggle={toggleShow} />}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
