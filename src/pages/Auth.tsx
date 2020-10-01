import React from "react";
import { Route, Redirect } from "react-router-dom";
import { IonPage, IonRouterOutlet } from "@ionic/react";
import Login from "./Auth/Login";
import Register from "./Auth/Register";

const Auth: React.FC = () => (
  <IonPage>
    <IonRouterOutlet>
      {/* test routes */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register/:ref?" component={Register} />

      <Route
        path="/auth"
        render={() => <Redirect to="/auth/login" />}
        exact={true}
      />
    </IonRouterOutlet>
  </IonPage>
);

export default Auth;
