import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
} from "@ionic/react";
import { arrowBack, checkmarkCircle, closeCircle } from "ionicons/icons";
import "./styles/AccountLevel.scss";
import { LoadingList } from "../../../components/ListLoader";
import { useProfile } from "../../../Hooks/ProfileHook";

const AccountLevel: React.FC = () => {
  const { goBack } = useContext(NavContext);

  const { data: profile } = useProfile();

  return (
    <IonPage>
      <IonContent className="AccountLevel">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <IonListHeader lines="none">
          <h1>Account Level</h1>
        </IonListHeader>
        {!profile ? (
          <LoadingList />
        ) : (
          <>
            <div className="levels">
              <div className="level">
                <h3>
                  Level 1 <IonIcon color="primary" icon={checkmarkCircle} />
                </h3>
                <p>Email address confirmed. limits $1000 - $20,000</p>
              </div>
              {profile?.trade_score ?? 0 >= 80 ? (
                <div className="level silver">
                  <h3>
                    Level 2 <IonIcon color="secondary" icon={checkmarkCircle} />
                  </h3>

                  <p>Silver Membership limit $40,000 - $80,000.</p>
                </div>
              ) : (
                <div className="level false">
                  <h3>
                    Level 2 <IonIcon color="medium" icon={closeCircle} />
                  </h3>

                  <p>
                    Deposit a minimum of $40,000 to be verified for a Silver
                    Membership. Silver members can accumulate maximum $80,000.
                  </p>
                </div>
              )}
              {profile?.trade_score ?? 0 >= 90 ? (
                <div className="level gold">
                  <h3>
                    Level 3 <IonIcon color="warning" icon={checkmarkCircle} />
                  </h3>
                  <p>Gold Membership limit: maximum of $200,000</p>
                </div>
              ) : (
                <div className="level false">
                  <h3>
                    Level 3 <IonIcon color="medium" icon={closeCircle} />
                  </h3>
                  <p>
                    Earn a minimum of $80,000 to qualify for Gold Membership,
                    Gold members can accumulate a maximum of $200,000
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default AccountLevel;
