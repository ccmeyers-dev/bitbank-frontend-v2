import React from "react";
import { IonModal, IonContent } from "@ionic/react";
import "./styles/TransactionDetailModal.scss";
import { TransactionHeader } from "./TransactionHeader";
import { TransactionDetailList } from "./TransactionList";
import { TransactionModalProp } from "../Interfaces/Transaction";

const TransactionDetailModal: React.FC<TransactionModalProp | null> = ({
  tx,
  show,
  closeModal,
}) => {
  // console.log("tx..", tx);
  return (
    <IonModal
      isOpen={show}
      swipeToClose={true}
      cssClass="transaction-detail-modal"
      onDidDismiss={closeModal}
    >
      <TransactionHeader
        type={tx?.type}
        amount={tx?.amount}
        closeModal={closeModal}
      />
      <IonContent>
        <div className="details">
          <div className="entry">
            <p>Market:</p>
            <p>{tx?.wallet}USD</p>
          </div>
          <div className="entry">
            <p>Position:</p>
            <p>{tx?.type}</p>
          </div>
          <div className="entry">
            <p>Equity:</p>
            <p>{(tx?.profit / tx?.duration!).toFixed(2)}</p>
          </div>
          <div className="entry">
            <p>Margin:</p>
            <p>{(tx?.profit / tx?.amount).toFixed(2)}</p>
          </div>
          <div className="entry">
            <p>Capital:</p>
            <p>{tx?.amount?.toFixed(2)}</p>
          </div>
        </div>
        <div className="tx">
          <div className="positions">
            <p>Positions</p>
          </div>
          <TransactionDetailList
            market={tx?.wallet}
            progress={tx?.progress}
            duration={tx?.duration}
            order={tx?.type}
            capital={tx?.amount?.toFixed(2)}
            current={tx?.current?.toFixed(4)}
          />
        </div>
      </IonContent>
    </IonModal>
  );
};
export default TransactionDetailModal;
