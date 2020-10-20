import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonRouterLink,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonAlert,
  IonToast,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack } from "ionicons/icons";
import "./styles/Profile.scss";
import { useParams, useHistory } from "react-router";
import axiosInstance from "../../services/baseApi";
import CopyToClipboard from "react-copy-to-clipboard";
import { LoadingList } from "../../components/ListLoader";
import { toCurrency, getInitials } from "../../components/utils/Utils";
import { mutate } from "swr";
import useSecureRequest from "../../Hooks/SecureRequest";
import { Link } from "react-router-dom";

interface UserProfileProp {
  id: number;
  account_id: number;
  password: string;
  referrer: string;
  trader_id: string;
  full_name: string;
  email: string;
  current: number;
  available: number;
  total: number;
  trade_score: number;
  is_admin: boolean;
  is_active: boolean;
}

const InitialUserProfile: UserProfileProp = {
  id: 0,
  account_id: 0,
  password: "",
  referrer: "",
  trader_id: "",
  full_name: "",
  email: "",
  current: 0,
  available: 0,
  total: 0,
  trade_score: 0,
  is_admin: false,
  is_active: true,
};
const Profile = () => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showAdminAlert, setShowAdminAlert] = useState(false);
  const [showActiveAlert, setShowActiveAlert] = useState(false);

  const [userProfile, setUserProfile] = useState(InitialUserProfile);

  const [showAdminToast, setShowAdminToast] = useState(false);
  const [showActiveToast, setShowActiveToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const [copyField, setCopyField] = useState("");

  const history = useHistory();

  const { id: userId } = useParams();

  const { data: user, update } = useSecureRequest(
    `/users/profile/?id=${userId}`
  );

  const deleteUser = () => {
    // console.log("deleting user...");
    axiosInstance
      .post(`/users/delete-user/${userProfile.account_id}/`)
      .then((res) => {
        // console.log(res.data);
        mutate("/users/portfolios/");
        mutate("/users/admin/");
        history.goBack();
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const toggleAdminUser = () => {
    // console.log("toggling admin user...");
    axiosInstance
      .post(`/users/toggle-admin/${userProfile.account_id}/`)
      .then((res) => {
        // console.log(res.data);
        setShowAdminToast(true);
        update();
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const toggleActiveUser = () => {
    // console.log("toggling admin user...");
    axiosInstance
      .post(`/users/toggle-active/${userProfile.account_id}/`)
      .then((res) => {
        // console.log(res.data);
        setShowActiveToast(true);
        update();
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const selectHandler = (field: string) => {
    setCopyField(field);
    setShowCopyToast(true);
  };

  useEffect(() => {
    // console.log("fetching user instance...");

    if (user) {
      setUserProfile({
        id: user.id,
        account_id: user.account.id,
        password: user.account.password2,
        referrer: user.referrer,
        trader_id: user.trader_id,
        full_name: user.full_name,
        email: user.account.email,
        current: user.current,
        available: user.available,
        total: user.total,
        trade_score: user.trade_score,
        is_admin: user.account.is_admin,
        is_active: user.account.is_active,
      });
    }
  }, [user]);

  return (
    <IonPage className="AdminProfile">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <IonRouterLink routerDirection="root" routerLink="/sudo/dashboard">
            <div className="back">
              <IonIcon className="back-button" icon={arrowBack} />
            </div>
          </IonRouterLink>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* refresher */}
        <Refresher />

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          cssClass="delete-user-alert"
          header={"Delete user"}
          message={"Are you sure you want to delete this user?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Delete",
              cssClass: "delete",
              handler: () => deleteUser(),
            },
          ]}
        />

        <IonAlert
          isOpen={showAdminAlert}
          onDidDismiss={() => setShowAdminAlert(false)}
          cssClass="toggle-admin-alert"
          header={"Toggle admin"}
          message={"Are you sure you want to continue?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: userProfile.is_admin ? "Remove Admin" : "Make Admin",
              cssClass: "admin",
              handler: () => toggleAdminUser(),
            },
          ]}
        />

        <IonAlert
          isOpen={showActiveAlert}
          onDidDismiss={() => setShowActiveAlert(false)}
          cssClass="toggle-admin-alert"
          header={"Toggle active"}
          message={"Are you sure you want to continue?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: userProfile.is_active ? "Deactivate User" : "Activate User",
              cssClass: "admin",
              handler: () => toggleActiveUser(),
            },
          ]}
        />

        <IonToast
          isOpen={showAdminToast}
          onDidDismiss={() => setShowAdminToast(false)}
          message="User status changed successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showActiveToast}
          onDidDismiss={() => setShowActiveToast(false)}
          message="Active status changed successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showCopyToast}
          onDidDismiss={() => setShowCopyToast(false)}
          message={`${copyField} copied successfully`}
          duration={1000}
        />
        {!user ? (
          <LoadingList />
        ) : (
          <div className="body">
            <div className="header">
              <Link to={`/sudo/credentials/${userProfile.id}`}>
                <div className="avatar">
                  <h1>{getInitials(userProfile.full_name)}</h1>
                </div>
              </Link>
              <h1 className="name">{userProfile.full_name}</h1>
              <p className="email">
                {userProfile.email}{" "}
                {userProfile.is_admin && <span>(admin)</span>}
              </p>

              {!userProfile.is_active && (
                <p className="inactive">Account deactivated</p>
              )}
            </div>

            <IonList mode="ios" className="details">
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Trader ID</h2>
                </IonLabel>
                <CopyToClipboard
                  text={userProfile.trader_id}
                  onCopy={() => selectHandler("Trader ID")}
                >
                  <IonLabel className="id ion-text-end">
                    <h3>{userProfile.trader_id}</h3>
                  </IonLabel>
                </CopyToClipboard>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Password</h2>
                </IonLabel>
                <CopyToClipboard
                  text={userProfile.password}
                  onCopy={() => selectHandler("Password")}
                >
                  <IonLabel className="id ion-text-end">
                    <h3>{userProfile.password}</h3>
                  </IonLabel>
                </CopyToClipboard>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Referrer</h2>
                </IonLabel>
                <CopyToClipboard
                  text={userProfile.referrer}
                  onCopy={() => selectHandler("Referrer")}
                >
                  <IonLabel className="id ion-text-end">
                    <h3>{userProfile.referrer}</h3>
                  </IonLabel>
                </CopyToClipboard>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Total Balance</h2>
                </IonLabel>
                <IonLabel className="balance ion-text-end">
                  <h3>{toCurrency(userProfile.total)} USD</h3>
                </IonLabel>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Current Balance</h2>
                </IonLabel>
                <IonLabel className="balance ion-text-end">
                  <h3>{toCurrency(userProfile.current)} USD</h3>
                </IonLabel>
              </IonItem>
              <IonItem className="ion-no-padding">
                <IonLabel>
                  <h2>Available Balance</h2>
                </IonLabel>
                <IonLabel className="balance ion-text-end">
                  <h3>{toCurrency(userProfile.available)} USD</h3>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonList mode="ios" className="actions">
              <IonItem
                routerLink={`/sudo/trades/${userProfile.id}`}
                className="ion-no-padding"
              >
                <IonLabel>
                  <h2>Trades</h2>
                </IonLabel>
              </IonItem>
              <IonItem
                routerLink={`/sudo/deposits/${userProfile.id}`}
                className="ion-no-padding"
              >
                <IonLabel>
                  <h2>Deposits</h2>
                </IonLabel>
              </IonItem>
              <IonItem
                routerLink={`/sudo/withdrawals/${userProfile.id}`}
                className="ion-no-padding"
              >
                <IonLabel>
                  <h2>Withdrawals</h2>
                </IonLabel>
              </IonItem>
              <IonItem
                routerLink={`/sudo/notifications/${userProfile.id}`}
                className="ion-no-padding"
              >
                <IonLabel>
                  <h2>Notifications</h2>
                </IonLabel>
              </IonItem>
              <IonItem
                routerLink={`/sudo/expert-trader/${userProfile.id}`}
                className="ion-no-padding"
              >
                <IonLabel>
                  <h2>Expert Trader Status</h2>
                </IonLabel>
                <IonLabel className="expert ion-text-end">
                  {userProfile.trade_score ? (
                    <h3 className="enabled">
                      {userProfile.trade_score}% (active)
                    </h3>
                  ) : (
                    <h3>Disabled</h3>
                  )}
                </IonLabel>
              </IonItem>
              <IonItem
                routerLink={`/sudo/credentials/${userProfile.id}`}
                className="ion-no-padding"
              >
                <IonLabel>
                  <h2>View More</h2>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonList lines="none" mode="ios" className="more">
              <IonItem
                className="ion-no-padding"
                onClick={() => setShowActiveAlert(true)}
              >
                <IonLabel>
                  {userProfile.is_active ? (
                    <h2>Deactivate</h2>
                  ) : (
                    <h2>Activate</h2>
                  )}
                </IonLabel>
              </IonItem>
            </IonList>

            <IonList lines="none" mode="ios" className="options">
              <IonItem
                className="ion-no-padding"
                onClick={() => setShowDeleteAlert(true)}
              >
                <IonLabel>
                  <h2>Delete User</h2>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonList lines="none" mode="ios" className="more">
              <IonItem
                className="ion-no-padding"
                onClick={() => setShowAdminAlert(true)}
              >
                <IonLabel>
                  {userProfile.is_admin ? (
                    <h2>Remove Admin</h2>
                  ) : (
                    <h2>Make Admin</h2>
                  )}
                </IonLabel>
              </IonItem>
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
