import React, { useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  NavContext,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/NotificationInstance.scss";
import { useParams, useLocation, useHistory } from "react-router";
import { LoadingList } from "../../../components/ListLoader";
import axiosInstance from "../../../services/baseApi";
import { mutate } from "swr";

const toggleStatus = (status: boolean, read: boolean, id: number, cb?: any) => {
  if (read === status) {
    // console.log("duplicate")
    return;
  }
  axiosInstance
    .patch(`/users/notifications/${id}/`, {
      read: status,
    })
    .then((res) => {
      mutate("/users/notifications/");
      mutate("/users/profile/");
    })
    .catch((err) => {
      //   console.log(err.response);
    });
  if (cb) {
    cb();
  }
};
const NotificationInstance: React.FC = () => {
  const { goBack } = useContext(NavContext);
  const { id } = useParams();
  const history = useHistory();

  const { state } = useLocation<any>();

  let notification: any;
  if (state) {
    notification = state.notification;
  }

  useEffect(() => {
    if (state === undefined) {
      history.replace("/tx/notifications");
    }
    if (notification) {
      toggleStatus(true, notification.read, id);
      // console.log("rendering");
    }
  }, [notification, id, state, history]);

  return (
    <IonPage>
      <IonContent className="NotificationInstance">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <p className="toggle"></p>
        {!notification ? (
          <LoadingList />
        ) : (
          <div className="body">
            <div className="content">
              <IonListHeader lines="none">
                <h1>{notification.title}</h1>
              </IonListHeader>
              <p className="message">{notification.message}</p>
              {notification.read && (
                <div
                  className="status"
                  onClick={() =>
                    toggleStatus(
                      false,
                      notification.read,
                      id,
                      goBack("/en/settings")
                    )
                  }
                >
                  <p>Mark as Unread</p>
                </div>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
export default NotificationInstance;