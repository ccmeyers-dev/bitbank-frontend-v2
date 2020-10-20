import React from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useScript } from "./Hooks/ScriptHook";

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
import Tabs from "./pages/Tabs";
import SubPages from "./pages/SubPages";
import AdminPages from "./pages/AdminPages";
import Auth from "./pages/Auth";
import Profile from "./pages/Auth/Profile";
import HomePage from "./pages/Landing/HomePage";

export const hasKey = () => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    console.log("JWT tokens not found");
    return false;
  }

  return true;
};

const AuthRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) =>
      /// check if only logged in user should authenticate
      hasKey() ? <Component {...props} /> : <Redirect to="/auth/login" exact />
    }
  />
);

const AnonymousOnlyRoute = ({ component: Component, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) =>
      /// make sure user is anonymous
      !hasKey() ? <Component {...props} /> : <Redirect to="/en/home" exact />
    }
  />
);

export const tradingViewId = "tradingView";
export const tradingViewSrc = "https://s3.tradingview.com/tv.js";

const App: React.FC = () => {
  useScript(tradingViewSrc, tradingViewId);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <AuthRoute path="/en" component={Tabs} />

          <AuthRoute path="/tx" component={SubPages} />

          <AuthRoute path="/sudo" component={AdminPages} />

          <AuthRoute path="/verify/profile" component={Profile} />

          <AnonymousOnlyRoute path="/auth" component={Auth} />

          <Route path="/home" component={HomePage} />

          <Route render={() => <Redirect to="/home" />} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
