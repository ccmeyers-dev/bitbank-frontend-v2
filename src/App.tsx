import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import decode from "jwt-decode";

import loadable from "@loadable/component";

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
// import Tabs from "./pages/Tabs";
// import SubPages from "./pages/SubPages";
// import Auth from "./pages/Auth";
// import HomePage from "./pages/Landing/HomePage";
// import AdminPages from "./pages/AdminPages";

const AsyncHome = loadable(() => import("./pages/Landing/HomePage"));
const AsyncAdmin = loadable(() => import("./pages/AdminPages"));
const AsyncSubPages = loadable(() => import("./pages/SubPages"));
const AsyncAuth = loadable(() => import("./pages/Auth"));
const AsyncTabs = loadable(() => import("./pages/Tabs"));

export const isAuthenticated = () => {
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

const ControlledRoute = ({
  component: Component,
  loggedInOnly = true,
  ...rest
}: any) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() === loggedInOnly ? (
        <Component {...props} />
      ) : (
        <Redirect to={loggedInOnly ? "/home" : "/en/home"} exact />
      )
    }
  />
);

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <ControlledRoute path="/en" component={AsyncTabs} />

          <ControlledRoute path="/tx" component={AsyncSubPages} />

          <ControlledRoute path="/sudo" component={AsyncAdmin} />

          <ControlledRoute
            path="/auth"
            component={AsyncAuth}
            loggedInOnly={false}
          />

          <Route path="/home" component={AsyncHome} />

          <Route render={() => <Redirect to="/home" />} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
