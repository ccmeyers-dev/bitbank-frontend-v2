import React, { useContext, useState } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  NavContext,
  IonToast,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack } from "ionicons/icons";
import "./styles/UserProfile.scss";
import { LoadingList } from "../../components/ListLoader";
import { toCurrency, getInitials } from "../../components/utils/Utils";
import CopyToClipboard from "react-copy-to-clipboard";
import { useProfile } from "../../Hooks/ProfileHook";

const UserProfile = () => {
  const { goBack } = useContext(NavContext);

  const [showToast, setShowToast] = useState(false);
  const [showReferralToast, setShowReferralToast] = useState(false);

  const { data: profile } = useProfile();

  const accountLevel = (score: number | null | undefined) => {
    if (score) {
      if (score >= 80) {
        if (score >= 90) {
          return "Level 3 (Gold)";
        } else {
          return "Level 2 (Silver)";
        }
      } else {
        return "Level 1";
      }
    } else {
      return "Level 1";
    }
  };

  return (
    <IonPage>
      <IonContent className="UserProfile">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <Refresher />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Trader ID copied successfully"
          cssClass="toast"
          duration={2000}
        />
        <IonToast
          isOpen={showReferralToast}
          onDidDismiss={() => setShowReferralToast(false)}
          message="Referral link copied successfully"
          cssClass="toast"
          duration={2000}
        />
        {!profile ? (
          <LoadingList />
        ) : (
          <div className="body">
            <div className="header">
              <div className="avatar">
                <h1>{getInitials(profile?.full_name!)}</h1>
              </div>
              <h1 className="name">{profile?.full_name}</h1>
              <p className="email">{profile?.account.email}</p>
            </div>

            <IonList mode="ios" className="details">
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Trader ID</h2>
                </IonLabel>
                <IonLabel className="id ion-text-end">
                  <h3>{profile?.trader_id}</h3>
                </IonLabel>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Country</h2>
                </IonLabel>
                <IonLabel className="id ion-text-end">
                  <h3>{profile?.profile?.country}</h3>
                </IonLabel>
              </IonItem>
              {profile?.trade_score && (
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Trader Score</h2>
                  </IonLabel>
                  <IonLabel className="score ion-text-end">
                    <h3>{profile?.trade_score}%</h3>
                  </IonLabel>
                </IonItem>
              )}
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Account Level</h2>
                </IonLabel>
                <IonLabel className="ion-text-end">
                  <h3>{accountLevel(profile?.trade_score)}</h3>
                </IonLabel>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Book Balance</h2>
                </IonLabel>
                <IonLabel className="balance ion-text-end">
                  <h3>{toCurrency(profile?.current)} USD</h3>
                </IonLabel>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Available Balance</h2>
                </IonLabel>
                <IonLabel className="balance ion-text-end">
                  <h3>{toCurrency(profile?.available)} USD</h3>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonList lines="none" mode="ios" className="more">
              <CopyToClipboard
                text={profile?.trader_id!}
                onCopy={() => setShowToast(true)}
              >
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Copy Trader ID</h2>
                  </IonLabel>
                </IonItem>
              </CopyToClipboard>
            </IonList>

            <IonList lines="none" mode="ios" className="more">
              <CopyToClipboard
                text={`${
                  window.location.origin
                }/auth/register/${profile?.trader_id!}`}
                onCopy={() => setShowReferralToast(true)}
              >
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Share Referral Link</h2>
                  </IonLabel>
                </IonItem>
              </CopyToClipboard>
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;
