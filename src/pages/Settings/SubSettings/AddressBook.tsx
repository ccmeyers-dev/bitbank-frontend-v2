import React, { useState, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonListHeader,
  IonToast,
  IonLoading,
  NavContext,
} from "@ionic/react";
import { arrowBack, copy } from "ionicons/icons";
import "./styles/AddressBook.scss";
import CopyToClipboard from "react-copy-to-clipboard";
import QRCode from "qrcode.react";

//axios
import { config } from "../../../app.config";
import { useWallets } from "../../../Hooks/WalletsHook";

const AddressBook: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [selected, setSelected] = useState("");

  const { data: wallets } = useWallets();

  const { goBack } = useContext(NavContext);

  const selectHandler = (wallet: string) => {
    setSelected(wallet);
    setShowToast(true);
  };
  return (
    <IonPage>
      <IonContent className="AddressBook">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        {!wallets ? (
          <IonLoading
            cssClass="my-custom-loading"
            isOpen={true}
            message={"Fetching wallets..."}
            duration={5000}
          />
        ) : (
          <>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={`${selected} wallet address successfully copied`}
              duration={2000}
            />
            <IonListHeader lines="none">
              <h1>Address Book</h1>
            </IonListHeader>

            {wallets.map(({ wallet, address }, i) => (
              <div key={i} className="wallet">
                <p>{wallet} address</p>
                <CopyToClipboard
                  text={address}
                  onCopy={() => selectHandler(wallet)}
                >
                  <div className="address">
                    <IonIcon icon={copy} />
                    <p>{address}</p>
                  </div>
                </CopyToClipboard>
                <a href={`${wallet.toLowerCase()}:${address}`}>
                  <div className="qrcode">
                    <QRCode value={address} size={240} />
                  </div>
                </a>
              </div>
            ))}

            <div className="brand">
              <p>{config.short_name} Inc.</p>
              <small>{config.location}</small>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};
export default AddressBook;
