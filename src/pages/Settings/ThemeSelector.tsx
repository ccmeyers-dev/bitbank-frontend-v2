import React, { useContext, useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonText,
  IonLabel,
  IonListHeader,
  IonList,
  IonIcon,
  NavContext,
} from "@ionic/react";
import "./styles/ThemeSelector.scss";
import { checkmark, arrowBack } from "ionicons/icons";

import { useTheme } from "../../Context/ThemeContext";

export const Themes = [
  {
    name: "Dark Theme",
    mode: "dark",
  },
  {
    name: "System Default",
    mode: "default",
  },
];

const ThemeSelector: React.FC = () => {
  const { goBack } = useContext(NavContext);
  const [appliedTheme, setAppliedTheme] = useState("");

  const { changeTheme } = useTheme();
  const localTheme = localStorage.getItem("theme");

  useEffect(() => {
    if (localTheme === null) {
      setAppliedTheme("default");
    } else {
      setAppliedTheme(localTheme);
    }
  }, [localTheme]);

  return (
    <IonPage>
      <IonContent className="ThemeSelector">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <IonListHeader lines="none">
          <h1>Theme</h1>
        </IonListHeader>
        <IonList lines="none">
          {Themes.map((x, i) => {
            const selected = x.mode === appliedTheme;
            // console.log(selected, x.mode, appliedTheme);
            return (
              <IonItem
                className="ion-no-padding"
                key={i}
                onClick={() => changeTheme(x.mode)}
              >
                <IonLabel>
                  {selected ? (
                    <IonText color="primary">
                      <h3>{x.name}</h3>
                      <IonIcon color="primary" icon={checkmark} />
                    </IonText>
                  ) : (
                    <h3>{x.name}</h3>
                  )}
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ThemeSelector;
