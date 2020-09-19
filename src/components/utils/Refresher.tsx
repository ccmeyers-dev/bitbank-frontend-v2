import React from "react";
import { IonRefresher, IonRefresherContent } from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { useHistory } from "react-router";

const Refresher: React.FC = () => {
  const history = useHistory();
  const useDoRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    // console.log("Begin async operation");
    setTimeout(() => {
      // console.log("Async operation has ended");
      // window.location.reload(false);
      event.detail.complete();
    }, 500);
    history.go(0);
  };
  return (
    <IonRefresher slot="fixed" onIonRefresh={useDoRefresh}>
      <IonRefresherContent></IonRefresherContent>
    </IonRefresher>
  );
};

export default Refresher;
