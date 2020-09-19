import React from "react";
import { IonList, IonItem } from "@ionic/react";
import "./styles/TransactionList.scss";

interface DetailListProp {
  market: string
  progress: number | null
  duration: number | null
  order: string
  capital: string
  current: string | undefined
}
export const TransactionDetailList: React.FC<DetailListProp> = ({market, progress, duration, order, capital, current}) => {
  return (
    <IonList className="TransactionList detail-list">
      <IonItem className="ion-no-padding">
        <div className="description">
          <div className="desc">
            <div className="currency">{market}USD, &nbsp;</div>
            <div className={`order ${order}`}>{order} {capital}</div>
          </div>
          <p>{duration!.toFixed(4)} -> {(duration! * (progress!/100)).toFixed(4)}</p>
        </div>
        <div className="amount">
          <h5>+{current}</h5>
        </div>
      </IonItem>
    </IonList>
  );
};
