import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  IonToast,
  IonLoading,
  IonButton,
  IonModal,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonRouterLink,
} from "@ionic/react";
import { arrowBack, closeCircle } from "ionicons/icons";
import "./styles/WalletAddress.scss";
import axiosInstance from "../../services/baseApi";
import useSecureRequest from "../../Hooks/SecureRequest";
import { WalletProp } from "../../Interfaces/Wallet";

const WalletAddress: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [newAddress, setNewAddress] = useState("");
  const [selectId, setSelectId] = useState(1);
  const [selectWallet, setSelectWallet] = useState("Bitcoin");
  const [selectSymbol, setSelectSymbol] = useState("BTC");

  const {
    data: wallets,
    update,
  }: { data: WalletProp[]; update: () => void } = useSecureRequest(
    "/users/wallets/"
  );

  const selectModal = (id: number, wallet: string, symbol: string) => {
    setSelectId(id);
    setSelectWallet(wallet);
    setSelectSymbol(symbol);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (newAddress.length > 10) {
      axiosInstance
        .put(`/users/wallets/${selectId}/`, {
          wallet: selectWallet,
          symbol: selectSymbol,
          address: newAddress,
        })
        .then(() => {
          setShowModal(false);
          setShowToast(true);
          update();
        });
    }
  };

  return (
    <IonPage>
      <IonContent className="AdminWalletAddress ion-padding">
        <IonRouterLink routerDirection="back" routerLink="/sudo/dashboard">
          <IonIcon className="back-button" icon={arrowBack} />
        </IonRouterLink>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={`${selectWallet} wallet address successfully updated`}
          duration={1000}
        />
        {!wallets ? (
          <IonLoading
            cssClass="my-custom-loading"
            isOpen={true}
            message={"Please wait..."}
            duration={5000}
          />
        ) : (
          <>
            <IonListHeader lines="none">
              <h1>Wallet Address</h1>
            </IonListHeader>

            {wallets.map(({ id, wallet, address, symbol }, i) => (
              <div key={i} className="wallet">
                <p>{wallet} address</p>
                <div className="address">
                  <p>{address}</p>
                </div>
                <div
                  onClick={() => selectModal(id, wallet, symbol)}
                  className={`update ${wallet}`}
                >
                  <p>Update {symbol} address</p>
                </div>
              </div>
            ))}
          </>
        )}
        <IonModal
          isOpen={showModal}
          swipeToClose={true}
          cssClass="address-modal"
          onDidDismiss={() => setShowModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Update {selectSymbol} address</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="input">
              <div className="input-box">
                <IonInput
                  placeholder="Enter new wallet address"
                  clearInput
                  value={newAddress}
                  onIonChange={(e) => setNewAddress(e.detail.value!)}
                />
              </div>
              <div onClick={handleUpdate} className="button">
                <IonButton mode="ios">Update address</IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
export default WalletAddress;
