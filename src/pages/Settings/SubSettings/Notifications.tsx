import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
  IonList,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";
import "./styles/Notifications.scss";
import { LoadingList } from "../../../components/ListLoader";
import { arrowBack, mailOpen, mail } from "ionicons/icons";
import useSecureRequest from "../../../Hooks/SecureRequest";
import Refresher from "../../../components/utils/Refresher";
import { Link } from "react-router-dom";
import { fullDate } from "../../../components/utils/Utils";

const Notifications: React.FC = () => {
  const { goBack } = useContext(NavContext);
  const { data: notifications } = useSecureRequest("/users/notifications/");

  return (
    <IonPage>
      <IonContent className="Notifications">
        <Refresher />
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <IonListHeader lines="none">
          <h1>Notifications</h1>
        </IonListHeader>
        {!notifications ? (
          <LoadingList />
        ) : (
          <IonList mode="ios">
            {notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <Link
                  key={notification.id}
                  to={{
                    pathname: `/tx/notifications/${notification.id}`,
                    state: { notification },
                  }}
                >
                  <IonItem className="NotificationItem ion-no-padding">
                    <div className="icon">
                      <IonIcon icon={notification.read ? mailOpen : mail} />
                    </div>
                    <IonLabel className="description">
                      <h3>{notification.title}</h3>
                      <p>{notification.message}</p>
                    </IonLabel>
                    <IonLabel className="badge">
                      <div
                        className={notification.read ? "read" : "unread"}
                      ></div>
                      <p>{fullDate(notification.date_created)}</p>
                    </IonLabel>
                  </IonItem>
                </Link>
              ))
            ) : (
              <IonText className="no-result">
                <h3>No Notifications</h3>
                <p>All notifications will appear here</p>
              </IonText>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};
export default Notifications;
