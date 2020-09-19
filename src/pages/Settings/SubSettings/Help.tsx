import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
  IonButton,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/Help.scss";
import { config } from "../../../app.config";

const Help: React.FC = () => {
  const { goBack } = useContext(NavContext);

  return (
    <IonPage>
      <IonContent className="Help">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <IonListHeader lines="none">
          <h1>Help</h1>
        </IonListHeader>
        <div className="content">
          <h5>How to deposit funds to your account?</h5>
          <p className="note">
            Funding your account is quick and simple. There are various payment
            methods compatible with your {config.short_name} Wallet. Simply
            choose whichever method you prefer to make a deposit
          </p>
          <div className="buy">
            <IonButton
              mode="ios"
              href="https://coinmama.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <p>Buy Crypto</p>
            </IonButton>
          </div>
          <ol>
            <li>
              Buy crypto directly to your wallet using the most supported
              merchant platform{" "}
              <a
                href="https://coinmama.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                coinmama.com
              </a>
            </li>
            <li>
              Buy crypto with{" "}
              <a
                href="https://lumiwallet.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lumi Wallet
              </a>{" "}
              and transfer to your trading wallet address
            </li>
            <li>
              Buy crypto with{" "}
              <a
                href="https://luno.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LUNO
              </a>{" "}
              and transfer to your trading wallet address
            </li>
            <li>
              Alternatively you can transfer crypto from other Third Party
              wallet to your wallet address conveiniently
            </li>
          </ol>

          <h5>What is the minimum First Time Deposit?</h5>
          <p className="note">
            There is no minimum deposit on your {config.short_name} Wallets.
            Although payment merchants may have a minimum purchase amount. Also
            note that there is a minimum amount required to place a Trade Order.
            This may vary by Region.
          </p>

          <h5>How to withdraw Profit?</h5>
          <p className="note">
            You can withdraw from your Available Wallet Balance using your
            preferred form of withdrawal. Withdrawals may require brokerage
            fees. Follow the steps below to make a withdrawal
          </p>
          <ul>
            <li>Click on Withdrawal from your Home Tab</li>
            <li>Select the wallet to withdraw from</li>
            <li>
              The Available Balance on each wallet is displayed as the MAX
              withdrawal amount for that wallet. Enter an amount not greater
              than the MAX withdrawal amount
            </li>
            <li>Click Withdraw to request withdrawal</li>
            <li>
              Withdrawal request with pending brokerage fees will require
              clearance to proceed
            </li>
            <li>
              After successful clearance you would be required to add your
              preferred payment method (ie. Bank, Skrill, PayPal, Crypto Wallet
              and others)
            </li>
            <li>
              Withdrawals takes a average of 20 minutes and vary by region
            </li>
          </ul>

          <h5>How to Trade Crypto?</h5>
          <p className="note">
            {config.short_name} makes Trading fast and easy in only a few clicks
          </p>
          <ol>
            <li>
              Click on the Crypto exchange market to trade on your Home Tab
            </li>
            <li>
              To place an Order click on the order type (ie. Buy Order, Sell
              Order or Copy Trade)
            </li>
            <li>Enter the amount you want to trade and Place an Order.</li>
          </ol>
        </div>

        <div className="brand">
          <p>{config.short_name} Inc.</p>
          <small>{config.location}</small>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Help;
