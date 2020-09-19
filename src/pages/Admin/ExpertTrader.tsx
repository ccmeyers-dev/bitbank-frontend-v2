import React, { useContext, useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  NavContext,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack } from "ionicons/icons";
import "./styles/ExpertTrader.scss";
import axiosInstance from "../../services/baseApi";
import { useParams, useHistory } from "react-router";

const ExpertTrader = () => {
  const { goBack } = useContext(NavContext);
  const [traderId, setTraderId] = useState();
  const [error, setError] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const history = useHistory();
  //test
  const { id: userId } = useParams();

  const handleExpertTrader = () => {
    setError(false);
    // console.log("setting score...");
    if (!traderId || !score) {
      // console.log("incomplete post data");
    } else if (score < 80 || score > 100) {
      // console.log("score not in range");
      setError(true);
    } else {
      axiosInstance
        .post(`users/set-expert/${traderId}/`, { score: score })
        .then((res) => {
          // console.log(res.data);
          history.goBack();
        })
        .catch((err) => {
          // console.log(err.response);
        });
    }
  };

  const deleteExpertTrader = () => {
    // console.log("removing status...");
    axiosInstance
      .post(`users/remove-expert/${traderId}/`)
      .then((res) => {
        // console.log(res.data);
        goBack();
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  useEffect(() => {
    // console.log("setting user " + userId);
    setTraderId(userId);
  }, [userId]);

  return (
    <IonPage className="AdminExpertTrader">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack()}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Expert Trader Status</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* refresher */}
        <Refresher />

        <div className="input">
          <div className="input-box">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonInput
                    type="number"
                    placeholder="Score"
                    clearInput
                    value={score}
                    onIonChange={(e) => {
                      let value = parseFloat(e.detail.value!);
                      if (isNaN(value)) {
                        value = 0;
                      }
                      setScore(value);
                    }}
                  />
                </IonCol>
              </IonRow>
              {error && <p className="note">Score must be between 80 - 100</p>}
            </IonGrid>
          </div>
          <div className="button">
            <IonButton mode="ios" onClick={() => handleExpertTrader()}>
              Save
            </IonButton>
          </div>
          <div className="delete">
            <p onClick={() => deleteExpertTrader()}>Remove Status</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExpertTrader;
