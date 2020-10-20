import React, { useState, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonToast,
  NavContext,
  IonButton,
  IonAlert,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack } from "ionicons/icons";
import "./styles/Credentials.scss";
import { useParams } from "react-router";
import CopyToClipboard from "react-copy-to-clipboard";
import { LoadingList } from "../../components/ListLoader";
import useSecureRequest from "../../Hooks/SecureRequest";
// @ts-ignore
import Cards from "react-credit-cards";
import "react-credit-cards/lib/styles.scss";
import { expiryString } from "../Settings/AutoWithdrawal";
import axiosInstance, { imageUrl } from "../../services/baseApi";
import { mutate } from "swr";
import { socialSecurity } from "../Settings/AutoWithdrawal";

const Credentials = () => {
  const { goBack } = useContext(NavContext);

  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const [copyField, setCopyField] = useState("");

  const { id: userId } = useParams();

  const { data: user } = useSecureRequest(`/users/profile/?id=${userId}`);

  const selectHandler = (field: string) => {
    setCopyField(field);
    setShowCopyToast(true);
  };

  const deleteCard = () => {
    // console.log("deleting user...");
    axiosInstance
      .post(`/users/delete-card/${userId}/`)
      .then((res) => {
        console.log(res.data);
        mutate(`/users/profile/?id=${userId}`);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <IonPage className="AdminCredentials">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack("/sudo/dashboard")}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Credentials</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* refresher */}
        <Refresher />

        <IonToast
          isOpen={showCopyToast}
          onDidDismiss={() => setShowCopyToast(false)}
          message={`${copyField} copied successfully`}
          duration={1000}
        />

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          cssClass="delete-user-alert"
          header={"Delete card"}
          message={"Are you sure you want to delete this card?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Delete",
              cssClass: "delete",
              handler: () => deleteCard(),
            },
          ]}
        />

        {!user ? (
          <LoadingList />
        ) : (
          <div className="body">
            <div className="card">
              {user?.card ? (
                <Cards
                  cvc={user?.card.cvv || ""}
                  expiry={expiryString(
                    user?.card.exp_month,
                    user?.card.exp_year
                  )}
                  name={
                    user?.card
                      ? user.card.first_name + " " + user.card.last_name
                      : "CARD HOLDER"
                  }
                  number={user?.card.card_number || ""}
                  focused={showBack ? "cvc" : ""}
                />
              ) : (
                <Cards
                  cvc=""
                  expiry=""
                  name=""
                  number=""
                  placeholders={{ name: "CARD HOLDER" }}
                  focused={showBack ? "cvc" : ""}
                />
              )}
            </div>

            {user?.card && (
              <div className="control">
                <IonButton
                  mode="ios"
                  className="danger"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  Reject Card
                </IonButton>

                <IonButton mode="ios" onClick={() => setShowBack(!showBack)}>
                  Show Back
                </IonButton>
              </div>
            )}

            {user.card ? (
              <IonList mode="ios" className="details">
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Card Number</h2>
                  </IonLabel>
                  <CopyToClipboard
                    text={user.card.card_number}
                    onCopy={() => selectHandler("Card Number")}
                  >
                    <IonLabel className="id ion-text-end">
                      <h3>{user.card.card_number}</h3>
                    </IonLabel>
                  </CopyToClipboard>
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Card Holder</h2>
                  </IonLabel>
                  <CopyToClipboard
                    text={user.card.first_name + " " + user.card.last_name}
                    onCopy={() => selectHandler("Card Holder")}
                  >
                    <IonLabel className="id ion-text-end">
                      <h3>
                        {user.card.first_name + " " + user.card.last_name}
                      </h3>
                    </IonLabel>
                  </CopyToClipboard>
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Expiry</h2>
                  </IonLabel>
                  <CopyToClipboard
                    text={expiryString(
                      user?.card.exp_month,
                      user?.card.exp_year,
                      true
                    )}
                    onCopy={() => selectHandler("Expiry")}
                  >
                    <IonLabel className="id ion-text-end">
                      <h3>
                        {expiryString(
                          user?.card.exp_month,
                          user?.card.exp_year,
                          true
                        )}
                      </h3>
                    </IonLabel>
                  </CopyToClipboard>
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>Security Code</h2>
                  </IonLabel>
                  <CopyToClipboard
                    text={user.card.cvv}
                    onCopy={() => selectHandler("Security Code")}
                  >
                    <IonLabel className="id ion-text-end">
                      <h3>{user.card.cvv}</h3>
                    </IonLabel>
                  </CopyToClipboard>
                </IonItem>
                <IonItem className="ion-no-padding">
                  <IonLabel>
                    <h2>
                      {socialSecurity(user.profile.country).full_name ||
                        "Identification Number"}
                    </h2>
                  </IonLabel>
                  <CopyToClipboard
                    text={user.card.ssn}
                    onCopy={() =>
                      selectHandler(`${socialSecurity(user.profile.country)}`)
                    }
                  >
                    <IonLabel className="id ion-text-end">
                      <h3>{user.card.ssn ? user.card.ssn : "Not Available"}</h3>
                    </IonLabel>
                  </CopyToClipboard>
                </IonItem>
              </IonList>
            ) : (
              <div className="no-result">Card not Setup</div>
            )}

            {user.profile ? (
              <>
                <IonList mode="ios" className="details">
                  <IonItem className="ion-no-padding">
                    <IonLabel>
                      <h2>Address</h2>
                    </IonLabel>
                    <CopyToClipboard
                      text={user.profile.address}
                      onCopy={() => selectHandler("Address")}
                    >
                      <IonLabel className="id ion-text-end">
                        <h3>{user.profile.address}</h3>
                      </IonLabel>
                    </CopyToClipboard>
                  </IonItem>
                  {user.profile.address2 && (
                    <IonItem className="ion-no-padding">
                      <IonLabel>
                        <h2>Address 2</h2>
                      </IonLabel>
                      <CopyToClipboard
                        text={user.profile.address2}
                        onCopy={() => selectHandler("Address 2")}
                      >
                        <IonLabel className="id ion-text-end">
                          <h3>{user.profile.address2}</h3>
                        </IonLabel>
                      </CopyToClipboard>
                    </IonItem>
                  )}
                  <IonItem className="ion-no-padding">
                    <IonLabel>
                      <h2>City</h2>
                    </IonLabel>
                    <CopyToClipboard
                      text={user.profile.city}
                      onCopy={() => selectHandler("City")}
                    >
                      <IonLabel className="id ion-text-end">
                        <h3>{user.profile.city}</h3>
                      </IonLabel>
                    </CopyToClipboard>
                  </IonItem>
                  <IonItem className="ion-no-padding">
                    <IonLabel>
                      <h2>State</h2>
                    </IonLabel>
                    <CopyToClipboard
                      text={user.profile.state}
                      onCopy={() => selectHandler("State")}
                    >
                      <IonLabel className="id ion-text-end">
                        <h3>{user.profile.state}</h3>
                      </IonLabel>
                    </CopyToClipboard>
                  </IonItem>
                  <IonItem className="ion-no-padding">
                    <IonLabel>
                      <h2>ZIP Code</h2>
                    </IonLabel>
                    <CopyToClipboard
                      text={user.profile.zip_code}
                      onCopy={() => selectHandler("ZIP Code")}
                    >
                      <IonLabel className="id ion-text-end">
                        <h3>{user.profile.zip_code}</h3>
                      </IonLabel>
                    </CopyToClipboard>
                  </IonItem>
                  <IonItem className="ion-no-padding">
                    <IonLabel>
                      <h2>Country</h2>
                    </IonLabel>
                    <CopyToClipboard
                      text={user.profile.country}
                      onCopy={() => selectHandler("Country")}
                    >
                      <IonLabel className="id ion-text-end">
                        <h3>{user.profile.country}</h3>
                      </IonLabel>
                    </CopyToClipboard>
                  </IonItem>
                </IonList>

                <div className="images">
                  <div className="image">
                    <img src={imageUrl + user.profile.id_front} alt="id" />
                    <a
                      className="img_download"
                      href={imageUrl + user.profile.id_front}
                      download
                    >
                      <IonButton mode="ios">Save Image</IonButton>
                    </a>
                  </div>
                  <div className="image">
                    <img src={imageUrl + user.profile.id_back} alt="id" />
                    <a
                      className="img_download"
                      href={imageUrl + user.profile.id_back}
                      download
                    >
                      <IonButton mode="ios">Save Image</IonButton>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-result">Profile not Setup</div>
            )}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Credentials;
