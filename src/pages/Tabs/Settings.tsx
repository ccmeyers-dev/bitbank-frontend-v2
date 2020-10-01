import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonText,
  IonLabel,
  IonListHeader,
  IonList,
  IonItemDivider,
  IonIcon,
  IonBadge,
  IonAlert,
} from "@ionic/react";
import {
  qrCode,
  shield,
  colorPalette,
  informationCircle,
  helpCircle,
  document,
  exit,
  leaf,
  cog,
  person,
} from "ionicons/icons";

// styles
import "./styles/Settings.scss";

// utils
import Refresher from "../../components/utils/Refresher";
import axiosInstance from "../../services/baseApi";
import { useHistory } from "react-router";
import { useProfile } from "../../Hooks/ProfileHook";

const Settings: React.FC = () => {
  const { data: profile } = useProfile();

  const history = useHistory();

  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>();

  const reloadTimeout = () => {
    history.replace("/home");
    setTimeout(() => {
      window.location.reload();
      return false;
    }, 2000);
  };

  const logoutHandler = () => {
    axiosInstance
      .post("/auth/token/blacklist/", {
        refresh_token: localStorage.getItem("refresh_token"),
      })
      .then((res) => {
        // console.log("logging out user...");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        axiosInstance.defaults.headers["Authorization"] = null;
        return reloadTimeout();
      })
      .catch((err) => {
        // console.log("error: ", err);
      });
  };

  const appliedTheme = localStorage.getItem("theme");

  const theme = () => {
    switch (appliedTheme) {
      case "light":
        return "Light Theme";
      case "dark":
        return "Dark Theme";
      default:
        return "System Default";
    }
  };

  useEffect(() => {
    if (profile) {
      setIsAdmin(profile?.account.is_admin);
    }
  }, [profile]);

  return (
    <IonPage>
      <IonContent className="Settings">
        {/* refresher */}
        <Refresher />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"Logout session"}
          message={"Are you sure you want to continue?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Logout",
              cssClass: "danger",
              handler: () => {
                logoutHandler();
              },
            },
          ]}
        />

        <IonListHeader lines="none">
          <h1>Settings</h1>
        </IonListHeader>

        <IonList mode="ios" lines="none">
          <IonItemDivider>
            <IonLabel>Crypto Wallet and Keys</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/tx/profile" detail>
            <IonIcon icon={person} />
            <IonLabel>
              <IonText>
                <h3>Profile</h3>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/address-book" detail>
            <IonIcon icon={qrCode} />
            <IonLabel>
              <IonText>
                <h3>Address Book</h3>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/account-level" detail>
            <IonIcon icon={shield} />
            <IonLabel>
              <IonText>
                <h3>Account Level</h3>
              </IonText>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonList mode="ios" lines="none">
          <IonItemDivider>
            <IonLabel>More</IonLabel>
          </IonItemDivider>

          <IonItem routerLink="/tx/theme" detail>
            <IonIcon icon={colorPalette} />
            <IonLabel>
              <IonText>
                <h3>Theme</h3>
                <IonBadge>
                  <h2>{theme()}</h2>
                </IonBadge>
              </IonText>
            </IonLabel>
          </IonItem>
          {isAdmin && (
            <IonItem routerLink="/sudo/dashboard" detail>
              <IonIcon icon={cog} />
              <IonLabel>
                <IonText>
                  <h3>Visit Admin</h3>
                </IonText>
              </IonLabel>
            </IonItem>
          )}
          <IonItem routerLink="/tx/help" detail>
            <IonIcon icon={helpCircle} />
            <IonLabel>
              <IonText>
                <h3>Help</h3>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/privacy-policy" detail>
            <IonIcon icon={informationCircle} />
            <IonLabel>
              <IonText>
                <h3>Privacy Policy</h3>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/terms" detail>
            <IonIcon icon={document} />
            <IonLabel>
              <IonText>
                <h3>Terms of Service</h3>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem routerLink="/tx/about" detail>
            <IonIcon icon={leaf} />
            <IonLabel>
              <IonText>
                <h3>About</h3>
              </IonText>
            </IonLabel>
          </IonItem>
          <IonItem onClick={() => setShowAlert(true)} className="logout" detail>
            <IonIcon icon={exit} />
            <IonLabel>
              <IonText>
                <h3>Logout</h3>
              </IonText>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
