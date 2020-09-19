import React, { useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonContent,
  IonButton,
} from "@ionic/react";
// copy to clipboard
import CopyToClipboard from "react-copy-to-clipboard";
import QRCode from "qrcode.react";
import { closeCircle, copy } from "ionicons/icons";
import "./styles/WalletAddressModal.scss";
import { WalletAddressProps } from "../Interfaces/Wallet";

const WalletAddressModal: React.FC<WalletAddressProps> = ({
  show,
  closeModal,
  wallet,
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <IonModal
      isOpen={show}
      swipeToClose={true}
      cssClass="wallet-address"
      onDidDismiss={closeModal}
    >
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <IonTitle>{wallet.wallet} address</IonTitle>
          <IonIcon
            className="back-button"
            icon={closeCircle}
            onClick={closeModal}
            slot="end"
          />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <CopyToClipboard text={wallet.address} onCopy={() => setCopied(true)}>
          <div className="address">
            <IonIcon icon={copy} />
            <p>{wallet.address}</p>
          </div>
        </CopyToClipboard>
        <a href={`${wallet.wallet.toLowerCase()}:${wallet.address}`}>
          <div className="qrcode">
            <QRCode value={wallet.address} size={240} />
          </div>
        </a>

        <div className="copy">
          <CopyToClipboard text={wallet.address} onCopy={() => setCopied(true)}>
            <IonButton color={copied ? "medium" : "primary"} mode="ios">
              <p>{copied ? "Copied" : "Copy wallet address"}</p>
            </IonButton>
          </CopyToClipboard>
        </div>
      </IonContent>
    </IonModal>
  );
};
export default WalletAddressModal;
