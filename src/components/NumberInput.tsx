import React from "react";
import { IonGrid, IonCol, IonRow, IonIcon } from "@ionic/react";
import "./styles/NumberInput.scss";
import { backspaceOutline } from "ionicons/icons";

interface FCProps {
  handleInput: (action: string) => void;
}
const NumberInput: React.FC<FCProps> = ({ handleInput }) => {
  const handleClick = (content: string) => {
    handleInput(content);
  };
  return (
    <IonGrid className="NumberInput">
      <IonRow>
        <IonCol onClick={() => handleClick("1")}>1</IonCol>
        <IonCol onClick={() => handleClick("2")}>2</IonCol>
        <IonCol onClick={() => handleClick("3")}>3</IonCol>
      </IonRow>
      <IonRow>
        <IonCol onClick={() => handleClick("4")}>4</IonCol>
        <IonCol onClick={() => handleClick("5")}>5</IonCol>
        <IonCol onClick={() => handleClick("6")}>6</IonCol>
      </IonRow>
      <IonRow>
        <IonCol onClick={() => handleClick("7")}>7</IonCol>
        <IonCol onClick={() => handleClick("8")}>8</IonCol>
        <IonCol onClick={() => handleClick("9")}>9</IonCol>
      </IonRow>
      <IonRow>
        <IonCol onClick={() => handleClick(".")}>.</IonCol>
        <IonCol onClick={() => handleClick("0")}>0</IonCol>
        <IonCol onClick={() => handleClick("del")}>
          <IonIcon icon={backspaceOutline} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default NumberInput;
