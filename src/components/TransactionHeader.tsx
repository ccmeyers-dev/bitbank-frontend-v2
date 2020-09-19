import React from "react";
import { IonHeader, IonToolbar, IonIcon, IonTitle } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import "./styles/TransactionHeader.scss";
import { headerBg } from "./utils/Utils";
import { TransactionHeaderProp } from "../Interfaces/Transaction";

export const TransactionHeader: React.FC<TransactionHeaderProp> = ({
  type,
  amount,
  closeModal,
}) => {
  return (
    <IonHeader className="ion-no-border" mode="ios">
      <IonToolbar className="TransactionHeader" color={headerBg(type)}>
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={closeModal}
        />
        <IonTitle>+{amount.toLocaleString()} USD</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
