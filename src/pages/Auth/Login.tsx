import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonRouterLink,
  IonIcon,
} from "@ionic/react";
import "./styles/Login.scss";
import axiosInstance from "../../services/baseApi";
import { useHistory } from "react-router";
import { config } from "../../app.config";
import { mutate } from "swr";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [processing, setProcessing] = useState(false);

  const history = useHistory();

  const loginHandler = () => {
    setError(false);
    setServerError(false);
    setProcessing(true);
    if (email && password) {
      axiosInstance
        .post("auth/token/obtain/", {
          email: email.toLowerCase(),
          password: password,
        })
        .then((res) => {
          axiosInstance.defaults.headers["Authorization"] =
            "JWT " + res.data.access;
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          setProcessing(false);
          mutate("/users/profile/");
          history.push("/en/home");
        })
        .catch((err) => {
          setError(true);
          // console.log(err.response);
          if (!err.response) {
            setServerError(true);
          }
          setProcessing(false);
        });
    }
  };

  return (
    <IonPage>
      <IonContent className="Login">
        <div className="form">
          <div className="header">
            <IonRouterLink routerDirection="root" routerLink="/home">
              <IonIcon src="coins/steem.svg" />
            </IonRouterLink>
            <h1>Login</h1>
          </div>
          <div className="form-input">
            <IonInput
              type="email"
              value={email}
              placeholder="Email address"
              name="email"
              onIonChange={(e) => setEmail(e.detail.value!)}
              clearInput
            />
            <IonInput
              type="password"
              value={password}
              placeholder="Password"
              name="password"
              onIonChange={(e) => setPassword(e.detail.value!)}
              clearInput
            />
          </div>
          {error &&
            (serverError ? (
              <div className="error">
                <p>Something went wrong, please try again later</p>
              </div>
            ) : (
              <div className="error">
                <p>Login credentials incorrect, please try again</p>
              </div>
            ))}

          <div className="button">
            {processing ? (
              <IonButton mode="ios" color="dark" expand="block">
                <p>Processing...</p>
              </IonButton>
            ) : (
              <IonButton
                mode="ios"
                color="dark"
                expand="block"
                onClick={loginHandler}
              >
                <p>Login</p>
              </IonButton>
            )}
          </div>
          <div className="help">
            Don't have an account?{" "}
            <IonRouterLink routerDirection="root" routerLink="/auth/register">
              Register
            </IonRouterLink>
          </div>
          <div className="brand">
            <p>{config.name} Inc.</p>
            <small>{config.location}</small>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
