import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/PrivacyPolicy.scss";
import { config } from "../../../app.config";

const PrivacyPolicy: React.FC = () => {
  const { goBack } = useContext(NavContext);

  return (
    <IonPage>
      <IonContent className="PrivacyPolicy">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <div className="content">
          <IonListHeader lines="none">
            <h1>Privacy Policy</h1>
          </IonListHeader>
          <p className="intro">
            We use third-party services in order to operate our website. Please
            note that these services may contain links to third-party apps,
            websites or services that are not operated by us. We make no
            representation or warranties with regard to and are not responsible
            for the content, functionality, legality, security, accuracy, or
            other aspects of such third-party apps, websites or services. Note
            that, when accessing and/or using these third-party services, their
            own privacy policy may apply.
          </p>

          <h2>Your privacy is important to us</h2>
          <p className="detail">Therefore, we guarantee that:</p>
          <ul className="list">
            <li>
              <p>We do not rent or sell your personal information to anyone.</p>
            </li>
            <li>
              <p>Any personal information you provide will be secured by us.</p>
            </li>
            <li>
              <p>
                You will be able to erase all the data we have stored on you at
                any given time. To request data termination, please contact our
                customer support.
              </p>
            </li>
          </ul>

          <h2>Information we collect</h2>
          <ul className="list">
            <li>
              <p>First Name & Last Name</p>
            </li>
            <li>
              <p>Approximate location (Nationality)</p>
            </li>
            <li>
              <p>Gender</p>
            </li>
            <li>
              <p>Email address and contact information</p>
            </li>
          </ul>
          <p className="detail">
            We do not collect passwords or any other sensitive information.
          </p>
        </div>
        <div className="brand">
          <p>{config.short_name} Inc.</p>
          <small>{config.location}</small>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default PrivacyPolicy;
