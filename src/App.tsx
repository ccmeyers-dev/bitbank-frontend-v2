import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import decode from "jwt-decode";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.scss";

// Route components
import Tabs from "./pages/Tabs";
import SubPages from "./pages/SubPages";
import Auth from "./pages/Auth";
import HomePage from "./pages/Landing/HomePage";
import { WalletProvider } from "./Context/WalletContext";
import { ProfileProvider } from "./Context/ProfileContext";
import AdminPages from "./pages/AdminPages";

export const checkAuth = () => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (!accessToken || !refreshToken) {
    console.log("JWT tokens not found");
    return false;
  }

  try {
    const { exp } = decode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      console.log("JWT token expired", exp, new Date().getTime() / 1000);
      return false;
    }
  } catch (e) {
    console.log("JWT token decode error");
    return false;
  }

  return true;
};

const ProtectedRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) =>
      checkAuth() ? (
        <WalletProvider>
          <ProfileProvider>
            <Component {...props} />
          </ProfileProvider>
        </WalletProvider>
      ) : (
        <Redirect to="/" exact />
      )
    }
  />
);

const AnonymousRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) =>
      !checkAuth() ? (
        <ProfileProvider>
          <Component {...props} />
        </ProfileProvider>
      ) : (
        <Redirect to="/en/home" exact />
      )
    }
  />
);

const HomeRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (
      <ProfileProvider>
        <Component {...props} />
      </ProfileProvider>
    )}
  />
);

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <ProtectedRoute path="/en" component={Tabs} />

          <ProtectedRoute path="/tx" component={SubPages} />

          <ProtectedRoute path="/sudo" component={AdminPages} />

          <AnonymousRoute path="/auth" component={Auth} />

          <HomeRoute path="/" component={HomePage} exact />

          <Route render={() => <Redirect to="/en/home" />} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
