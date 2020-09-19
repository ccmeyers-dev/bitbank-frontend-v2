import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/Terms.scss";
import { config } from "../../../app.config";

const Terms: React.FC = () => {
  const { goBack } = useContext(NavContext);

  return (
    <IonPage>
      <IonContent className="Terms">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <div className="content">
          <IonListHeader lines="none">
            <h1>Terms of Service</h1>
          </IonListHeader>
          <p className="intro">
            By using {config.name} you agree to and are bound by these Terms and
            Conditions in their entirety and, without reservation, all
            applicable laws and regulations, and you agree that you are
            responsible for compliance with any applicable laws. These Terms of
            Service govern your use of this website. If you do not agree with
            any of these terms, you are prohibited from using {config.name}.
          </p>

          <h2>Acceptable use</h2>
          <ul className="list">
            <li>
              <p>
                You must not use {config.name} in any way that can cause damage
                to {config.name} or in any way which is unlawful, illegal,
                fraudulent or harmful, or in connection with any illegal,
                fraudulent, or harmful activity.
              </p>
            </li>
            <li>
              <p>
                You must not use {config.name} to send any sort of commercial
                communications.
              </p>
            </li>
            <li>
              <p>
                You must not use {config.name} for any purposes related to
                marketing without the permission of {config.name}.
              </p>
            </li>
            <li>
              <p>
                You must not use {config.name} to publish or distribute any
                material which consists of (or is linked to) any spyware,
                computer virus, Trojan horse, worm, keylogger, rootkit, or other
                malicious software.
              </p>
            </li>
          </ul>

          <h2>Membership</h2>
          <ul className="list">
            <li>
              <p>
                Users must be 18 years old and above or 13 years to 18 years old
                with parental permission. A user between the ages of 13 to 18
                certifies that a parent has given permission before signing up.
              </p>
            </li>
            <li>
              <p>
                Users must provide valid and truthful information during all
                stages.
              </p>
            </li>
            <li>
              <p>
                Users must not create more than one account per person, as
                having multiple accounts may result in all accounts being
                suspended and all points forfeited
              </p>
            </li>
            <li>
              <p>
                Users must not use a proxy or attempt to mask or reroute their
                internet connection. That will result in your all accounts being
                suspended.
              </p>
            </li>
            <li>
              <p>
                We reserve the right to close your account, and forfeit any
                points, if you have violated our terms of service agreement.
              </p>
            </li>
            <li>
              <p>
                We reserve the right to close your account due to inactivity of
                9 or more months. An inactive account is defined as an account
                that has not earned any gems for 9 or more months
              </p>
            </li>
          </ul>

          <h2>Indemnity</h2>
          <p className="block">
            You hereby indemnify {config.name} and undertake to keep{" "}
            {config.name} indemnified against any losses, damages, costs,
            liabilities, and/or expenses (including without limitation legal
            expenses) and any amounts paid by {config.name} to a third party in
            settlement of a claim or dispute on the advice of {config.name}’s
            legal advisers) incurred or suffered by {config.name} arising out of
            any breach by you of any provision of these terms and conditions, or
            arising out of any claim that you have breachedany provision of
            these terms and conditions.
          </p>

          <h2>Unenforceable provisions</h2>
          <p className="block">
            If any provision of {config.name} disclaimer is, or is found to be,
            unenforceable under applicable law, that will not affect the
            enforceability of the other provisions of {config.name} disclaimer.
          </p>

          <h2>Breaches of these terms and conditions</h2>
          <ul className="list">
            <li>
              <p>
                {config.name} reserves the rights under these terms and
                conditions to take action if you breach these terms and
                conditions in any way.
              </p>
            </li>
            <li>
              <p>
                {config.name} may take such action as seems appropriate to deal
                with the breach, including suspending your access to the
                website, suspending your earnings made through {config.name},
                prohibiting you from accessing the website, or bringing court
                proceedings against you.
              </p>
            </li>
          </ul>
        </div>
        <div className="brand">
          <p>{config.short_name} Inc.</p>
          <small>{config.location}</small>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default Terms;
