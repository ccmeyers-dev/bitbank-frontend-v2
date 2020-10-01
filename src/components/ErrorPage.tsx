import React from "react";
import { IonIcon, IonRouterLink } from "@ionic/react";
import { warning } from "ionicons/icons";
import "./styles/ErrorPage.scss";
import { useHistory } from "react-router";

const ErrorPage: React.FC = () => {
  const history = useHistory();
  return (
    <div className="ErrorPage">
      <h1>Something went wrong</h1>
      <div className="icon">
        <IonIcon icon={warning} />
      </div>
      <p onClick={() => history.go(0)}>Try again</p>
      <IonRouterLink routerLink="/home" routerDirection="root">
        <p className="home">Go home</p>
      </IonRouterLink>
    </div>
  );
};

export default ErrorPage;
