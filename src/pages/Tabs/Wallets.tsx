import React from "react";
import {
  IonContent,
  IonPage,
  IonList,
  IonListHeader,
  IonIcon,
  IonButton,
  IonLoading,
} from "@ionic/react";
import { ellipsisHorizontal, qrCodeOutline } from "ionicons/icons";
import "./styles/Wallets.scss";
import Refresher from "../../components/utils/Refresher";
import { WalletItem } from "../../components/WalletItem";

//context
import { useWallets } from "../../Context/WalletContext";
import ErrorPage from "../../components/ErrorPage";

const Wallets: React.FC = () => {
  const { wallets, loading, error } = useWallets();

  return (
    <IonPage>
      <IonContent className="ion-padding Wallets">
        <Refresher />
        {loading ? (
          <IonLoading
            cssClass="my-custom-loading"
            isOpen={true}
            message={"Please wait..."}
            duration={5000}
          />
        ) : error ? (
          <ErrorPage />
        ) : (
          <>
            <IonIcon className="icon" icon={ellipsisHorizontal} />

            <IonListHeader>
              <h1>Wallets</h1>
            </IonListHeader>
            <IonList lines="none" mode="ios">
              {wallets.map((wallet) => (
                <WalletItem key={wallet.id} wallet={wallet} />
              ))}
            </IonList>
            <div className="scan-button">
              <IonButton routerLink="/tx/address-book/" shape="round">
                <IonIcon slot="start" icon={qrCodeOutline} />
                View address book
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Wallets;
