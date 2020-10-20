import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonInput,
  IonRouterLink,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from "@ionic/react";
import "./styles/Register.scss";
import axiosInstance from "../../services/baseApi";
import { useHistory, useParams } from "react-router";
import { config } from "../../app.config";

interface ErrorProp {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  password: string | null;
}

const initialError = {
  email: null,
  firstName: null,
  lastName: null,
  gender: null,
  password: null,
};

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<ErrorProp>(initialError);
  const [serverError, setServerError] = useState(false);

  const [processing, setProcessing] = useState(false);

  const history = useHistory();

  const { ref } = useParams();

  const validate = () => {
    let valid = true;
    let formErrors: ErrorProp = initialError;

    const pwd = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

    // handle inconsistent fields
    if (pwd.test(password) === false) {
      formErrors = {
        ...formErrors,
        password: "Password should contain characters and at least a number",
      };
      valid = false;
    }
    if (password.length < 8) {
      formErrors = {
        ...formErrors,
        password: "Password too short, should be at least 8 charaters",
      };
      valid = false;
    }
    if (password !== confirmPassword) {
      formErrors = { ...formErrors, password: "Passwords do no match" };
      valid = false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      formErrors = { ...formErrors, email: "Invalid email address" };
      valid = false;
    }

    // handle empty fields
    if (!email) {
      formErrors = { ...formErrors, email: "Email Required" };
      valid = false;
    }
    if (!firstName) {
      formErrors = { ...formErrors, firstName: "First Name Required" };
      valid = false;
    }
    if (!lastName) {
      formErrors = { ...formErrors, lastName: "Last Name Required" };
      valid = false;
    }
    if (!gender) {
      formErrors = { ...formErrors, gender: "Gender Required" };
      valid = false;
    }
    if (!password) {
      formErrors = { ...formErrors, password: "Password Required" };
      valid = false;
    }

    setError(formErrors);
    return valid;
  };
  const RegisterHandler = () => {
    setServerError(false);
    // console.log("registering...");
    const isValid = validate();

    if (isValid) {
      setProcessing(true);
      axiosInstance
        .post("/auth/user/create/", {
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          gender: gender,
          referrer: localStorage.getItem("ref"),
          password: password,
        })
        .then((res) => {
          localStorage.setItem("visited", "true");
          localStorage.removeItem("ref");
          setProcessing(false);
          history.push("/auth/login");
        })
        .catch((err) => {
          if (!err.response) {
            setServerError(true);
          } else {
            if (err.response.status === 400) {
              const error = err.response.data;
              if (error.email) {
                const email_error = error.email[0];
                setError({ ...error, email: email_error });
              }
            }
          }
          // console.log("err res", err.response);
          setProcessing(false);
        });
    }
  };

  useEffect(() => {
    if (ref) {
      localStorage.setItem("ref", ref);
    }
  }, [ref]);

  return (
    <IonPage>
      <IonContent className="Register">
        <div className="form">
          <div className="header">
            <IonRouterLink routerDirection="root" routerLink="/home">
              <IonIcon src="coins/logo.svg" />
            </IonRouterLink>
            <h1>Register</h1>
          </div>
          <div className="form-input">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonInput
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Email address"
                    onIonChange={(e) => setEmail(e.detail.value!)}
                  />
                </IonCol>
              </IonRow>
              <p className="error">{error.email}</p>
              <IonRow>
                <IonCol>
                  <IonInput
                    type="text"
                    name="first_name"
                    value={firstName}
                    placeholder="First Name"
                    onIonChange={(e) => setFirstName(e.detail.value!)}
                  />
                  <p className="error">{error.firstName}</p>
                </IonCol>
                <IonCol>
                  <IonInput
                    type="text"
                    name="last_name"
                    value={lastName}
                    placeholder="Last Name"
                    onIonChange={(e) => setLastName(e.detail.value!)}
                  />
                  <p className="error">{error.lastName}</p>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonSelect
                    interface="action-sheet"
                    value={gender}
                    placeholder="Gender"
                    name="gender"
                    onIonChange={(e) => setGender(e.detail.value)}
                  >
                    <IonSelectOption value="male">Male</IonSelectOption>
                    <IonSelectOption value="female">Female</IonSelectOption>
                    <IonSelectOption value="other">Other</IonSelectOption>
                  </IonSelect>
                  <p className="error">{error.gender}</p>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    type="password"
                    value={password}
                    placeholder="Password"
                    name="password"
                    onIonChange={(e) => setPassword(e.detail.value!)}
                    clearInput
                  />
                </IonCol>
                <IonCol>
                  <IonInput
                    type="password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    name="confirm_password"
                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    clearInput
                  />
                </IonCol>
              </IonRow>
              <p className="error">{error.password}</p>
              {serverError && (
                <p className="error">
                  Something went wrong, please try again later
                </p>
              )}
            </IonGrid>
          </div>
          <div className="button">
            {processing ? (
              <IonButton mode="ios" expand="block">
                <p>Submitting</p>
                <IonSpinner name="crescent" />
              </IonButton>
            ) : (
              <IonButton mode="ios" expand="block" onClick={RegisterHandler}>
                <p>Register</p>
              </IonButton>
            )}
          </div>
          <div className="help">
            Already have an account?{" "}
            <IonRouterLink routerDirection="root" routerLink="/auth/login">
              Login
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

export default Register;
