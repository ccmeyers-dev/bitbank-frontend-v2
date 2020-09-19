import React from "react";
import { IonSpinner } from "@ionic/react";
import "./styles/ListLoader.scss";

export const LoadingList: React.FC = () => {
  return (
    <div className="LoadingList">
      <IonSpinner />
    </div>
  );
};

export const ErrorList: React.FC = () => {
  return (
    <div className="ErrorList">
      <h1>Something went wrong</h1>
      <p>Transactions could not be loaded</p>
    </div>
  );
};
