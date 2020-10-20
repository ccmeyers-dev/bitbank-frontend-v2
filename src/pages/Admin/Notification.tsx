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
  IonList,
  IonLabel,
  IonItem,
  IonModal,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonText,
  IonTextarea,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack, closeCircle, mail, mailOpen } from "ionicons/icons";
import "./styles/Notification.scss";
import axiosInstance from "../../services/baseApi";
import { LoadingList } from "../../components/ListLoader";
import { useParams } from "react-router";
import useSecureRequest from "../../Hooks/SecureRequest";
import { mutate } from "swr";

interface AddNotificationItem {
  title: string | null;
  message: string | null;
  read: false;
  portfolio: number | null;
}

const InitialAddNotification: AddNotificationItem = {
  title: null,
  message: null,
  read: false,
  portfolio: null,
};

interface NotificationItem {
  id: number;
  title: string | null;
  message: string | null;
  read: false;
  portfolio: number | null;
}

const InitialNotification: NotificationItem = {
  id: 0,
  title: null,
  message: null,
  read: false,
  portfolio: null,
};

const Notification = () => {
  const { goBack } = useContext(NavContext);

  const [selectNotification, setSelectNotification] = useState(
    InitialNotification
  );
  const [addNotification, setAddNotification] = useState(
    InitialAddNotification
  );

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAddNotificationModal, setShowAddNotificationModal] = useState(
    false
  );

  const [showAddToast, setShowAddToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  const { id: userId } = useParams();

  const {
    data: notifications,
    update,
  }: { data: NotificationItem[]; update: () => void } = useSecureRequest(
    `/users/notifications/?id=${userId}`
  );

  const newNotification = () => {
    // console.log("posting Notification...");
    if (
      !addNotification.title ||
      !addNotification.message ||
      !addNotification.portfolio
    ) {
      // console.log("incomplete post data");
    } else {
      axiosInstance
        .post("/users/notifications/", addNotification)
        .then((res) => {
          // console.log(res.data);
          setShowAddNotificationModal(false);
          setShowAddToast(true);
          setAddNotification({ ...addNotification, title: "", message: "" });
          update();
          mutate("/users/profile/");
        })
        .catch((err) => {
          // console.log(err.response);
        });
    }
  };

  const updateNotification = () => {
    // console.log("posting Notification...");
    if (
      !selectNotification.title ||
      !selectNotification.message ||
      !selectNotification.portfolio
    ) {
      // console.log("incomplete post data");
    } else {
      axiosInstance
        .put(
          `/users/notifications/${selectNotification.id}/`,
          selectNotification
        )
        .then((res) => {
          // console.log(res.data);
          setShowNotificationModal(false);
          setShowUpdateToast(true);
          update();
          mutate("/users/profile/");
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const toggleStatus = () => {
    // console.log("toggling Notification status...");
    axiosInstance
      .patch(`/users/notifications/${selectNotification.id}/`, {
        read: !selectNotification.read,
      })
      .then((res) => {
        // console.log(res.data);
        setShowNotificationModal(false);
        setShowUpdateToast(true);
        update();
        mutate("/users/profile/");
      })
      .catch((err) => {
        // console.log(err.response);
        setSelectNotification(InitialNotification);
        setShowNotificationModal(false);
      });
  };

  const handleNotification = (notification: NotificationItem) => {
    setSelectNotification((current) => ({ ...current, ...notification }));
    setShowNotificationModal(true);
  };

  const deleteNotification = () => {
    // console.log("deleting Notification...");
    axiosInstance
      .delete(`/users/notifications/${selectNotification.id}/`)
      .then((res) => {
        // console.log(res.data);
        setShowNotificationModal(false);
        setShowDeleteToast(true);
        update();
        mutate("/users/profile/");
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  useEffect(() => {
    // console.log("setting user " + userId);
    setAddNotification((current) => ({ ...current, portfolio: userId }));
  }, [userId]);

  return (
    <IonPage className="AdminNotification">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack()}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* refresher */}
        <Refresher />
        <IonToast
          isOpen={showAddToast}
          onDidDismiss={() => setShowAddToast(false)}
          message="Notification added successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showDeleteToast}
          onDidDismiss={() => setShowDeleteToast(false)}
          message="Notification deleted successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showUpdateToast}
          onDidDismiss={() => setShowUpdateToast(false)}
          message="Notification updated successfully"
          duration={1000}
        />

        <div className="button">
          <IonButton
            color="primary"
            mode="ios"
            onClick={() => setShowAddNotificationModal(true)}
          >
            Add Notification
          </IonButton>
        </div>
        {!notifications ? (
          <LoadingList />
        ) : (
          <IonList mode="ios">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <IonItem
                  onClick={() => handleNotification(notification)}
                  key={notification.id}
                  className="NotificationItem ion-no-padding"
                >
                  <div className="icon">
                    <IonIcon icon={notification.read ? mailOpen : mail} />
                  </div>
                  <IonLabel className="description">
                    <h3>{notification.title}</h3>
                    <p>Message title</p>
                  </IonLabel>
                  <IonLabel className="amount">
                    <h5>{notification.read ? "Read" : "Unread"}</h5>
                    <p>status</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonText className="no-result">
                <h3>No Notifications</h3>
                <p>All notifications will appear here</p>
              </IonText>
            )}
          </IonList>
        )}
        <IonModal
          isOpen={showNotificationModal}
          swipeToClose={true}
          cssClass="notification-modal"
          onDidDismiss={() => setShowNotificationModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Update Notification</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowNotificationModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="details">
              <div className="title">
                <p>{selectNotification.title}</p>
              </div>
              <div className="message">
                <p className="body">{selectNotification.message}</p>
              </div>
            </div>
            <div className="input">
              <div className="input-box">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="text"
                        placeholder="Title"
                        value={selectNotification.title}
                        onIonChange={(e) => {
                          setSelectNotification((current) => ({
                            ...current,
                            title: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonTextarea
                        placeholder="Message"
                        rows={5}
                        value={selectNotification.message}
                        onIonChange={(e) => {
                          setSelectNotification((current) => ({
                            ...current,
                            message: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => updateNotification()}>
                  Update Notification
                </IonButton>
              </div>
              {selectNotification.read ? (
                <div className="read" onClick={() => toggleStatus()}>
                  <p>Mark as Unread</p>
                </div>
              ) : (
                <div className="unread" onClick={() => toggleStatus()}>
                  <p>Mark as Read</p>
                </div>
              )}
              <div className="delete">
                <p onClick={() => deleteNotification()}>Delete Notification</p>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showAddNotificationModal}
          swipeToClose={true}
          cssClass="notification-modal"
          onDidDismiss={() => setShowAddNotificationModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Add Notification</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowAddNotificationModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="input">
              <div className="input-box">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="text"
                        placeholder="Title"
                        value={addNotification.title}
                        onIonChange={(e) => {
                          setAddNotification((current) => ({
                            ...current,
                            title: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonTextarea
                        placeholder="Message"
                        rows={5}
                        value={addNotification.message}
                        onIonChange={(e) => {
                          setAddNotification((current) => ({
                            ...current,
                            message: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => newNotification()}>
                  Add Notification
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Notification;
