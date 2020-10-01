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
} from "@ionic/react";
import "./styles/Register.scss";
import { CurrencyList } from "../../MockData/currency";
import axiosInstance from "../../services/baseApi";
import { useHistory, useParams } from "react-router";
import { config } from "../../app.config";

interface ErrorProp {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  region: string | null;
  password: string | null;
}

const initialError = {
  email: null,
  firstName: null,
  lastName: null,
  gender: null,
  region: null,
  password: null,
};

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [region, setRegion] = useState("");
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

    const pwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;

    // handle inconsistent fields
    if (pwd.test(password) === false) {
      formErrors = {
        ...formErrors,
        password:
          "Password should contain at least an Upper case character, a Lower case character and a Number",
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

    // handle spaces in name
    if (firstName.includes(" ")) {
      formErrors = {
        ...formErrors,
        firstName: "Cannot contain spaces",
      };
      valid = false;
    }
    if (lastName.includes(" ")) {
      formErrors = { ...formErrors, lastName: "Cannot contain spaces" };
      valid = false;
    }

    // handle empty fields
    if (email === "") {
      formErrors = { ...formErrors, email: "Enter email address" };
      valid = false;
    }
    if (firstName === "") {
      formErrors = { ...formErrors, firstName: "Enter first name" };
      valid = false;
    }
    if (lastName === "") {
      formErrors = { ...formErrors, lastName: "Enter last name" };
      valid = false;
    }
    if (gender === "") {
      formErrors = { ...formErrors, gender: "Enter gender" };
      valid = false;
    }
    if (region === "") {
      formErrors = { ...formErrors, region: "Enter region" };
      valid = false;
    }
    if (password === "") {
      formErrors = { ...formErrors, password: "Enter password" };
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
        .post("auth/user/create/", {
          email: email.toLowerCase(),
          first_name: firstName,
          last_name: lastName,
          region: region,
          gender: gender,
          referrer: localStorage.getItem("ref"),
          password: password,
        })
        .then((res) => {
          // console.log(res.data);
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
              <IonIcon src="coins/steem.svg" />
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
                    clearInput
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
                    clearInput
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
                    clearInput
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
                <IonCol>
                  <IonSelect
                    value={region}
                    placeholder="Region"
                    name="region"
                    onIonChange={(e) => setRegion(e.detail.value)}
                  >
                    {CurrencyList.map((country, i) => (
                      <IonSelectOption key={i} value={country.name}>
                        {country.name}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                  <p className="error">{error.region}</p>
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
              <IonButton mode="ios" color="dark" expand="block">
                <p>Processing...</p>
              </IonButton>
            ) : (
              <IonButton
                mode="ios"
                color="dark"
                expand="block"
                onClick={RegisterHandler}
              >
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
