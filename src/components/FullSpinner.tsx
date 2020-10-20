import React from "react";
import { IonSpinner } from "@ionic/react";

interface SpinnerProp {
  color?: string;
}

const FullSpinner: React.FC<SpinnerProp> = ({ color = "primary" }) => (
  <div className="loading-spinner">
    <IonSpinner color={color} name="crescent" />
  </div>
);

export default FullSpinner;
