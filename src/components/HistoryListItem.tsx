import React from "react";
import { IonItem, IonIcon, IonLabel } from "@ionic/react";

// styles
import "./styles/HistoryListItem.scss";
import { HistoryIconSelector } from "./utils/Utils";
import { TransactionListProp } from "../Interfaces/Transaction";

//mock data
import { useCoinValue } from "../Hooks/CoinValueHook";

const HistoryListItem: React.FC<TransactionListProp> = ({ tx, toggleShow }) => {
  return (
    <IonItem onClick={toggleShow} className="HistoryListItem ion-no-padding">
      <div className="icon">
        <IonIcon icon={HistoryIconSelector(tx.type)} />
      </div>
      <IonLabel className="description">
        <h3>
          {tx.type === "withdrawal" ? "Withdrawal" : `${tx.wallet} wallet`}
        </h3>
        <p>
          {tx.current
            ? tx.current.toFixed(4) + " USD"
            : tx.amount.toFixed(4) + " USD"}
        </p>
      </IonLabel>
      <IonLabel className="amount">
        <h5>{tx.amount} USD</h5>
        <p>
          {useCoinValue(tx.wallet, tx.amount)} {tx.wallet}
        </p>
      </IonLabel>
    </IonItem>
  );
};
export default HistoryListItem;
