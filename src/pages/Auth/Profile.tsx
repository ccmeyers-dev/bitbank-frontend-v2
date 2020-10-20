import React, { useReducer, useRef, useEffect } from "react";
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
  IonProgressBar,
} from "@ionic/react";
import "./styles/Profile.scss";
import { Countries } from "../../MockData/countries";
import { config } from "../../app.config";
import { checkmarkCircle } from "ionicons/icons";
import axiosInstance from "../../services/baseApi";
import { useProfile } from "../../Hooks/ProfileHook";
import { useHistory, useLocation } from "react-router";

interface stateData {
  address: string;
  address2: string;
  city: string;
  zip_code: string;
  state: string;
  country: string;
  id_front: any;
  id_back: any;
}

interface stateProp {
  serverError: boolean;
  processing: boolean;
  success: boolean;
  data: stateData;
  error: stateData;
}

const emptyData = {
  address: "",
  address2: "",
  city: "",
  zip_code: "",
  state: "",
  country: "",
  id_front: "",
  id_back: "",
};
const initialState = {
  serverError: false,
  processing: false,
  success: false,
  data: emptyData,
  error: emptyData,
};

const reducer = (state: stateProp, { type, payload }: any) => {
  switch (type) {
    case "reset":
      return initialState;
    case "request":
      return {
        ...state,
        serverError: false,
        processing: true,
        error: emptyData,
      };
    case "success":
      return {
        ...state,
        success: true,
        processing: false,
      };
    case "error":
      return {
        ...state,
        error: {
          ...payload,
        },
        processing: false,
      };
    case "server-error":
      return {
        ...state,
        serverError: true,
        processing: false,
      };
    case "input":
      return {
        ...state,
        data: {
          ...state.data,
          [payload.field]: payload.value,
        },
      };
    default:
      return state;
  }
};
const Profile: React.FC = () => {
  const history = useHistory();
  const { state: routeState } = useLocation<any>();
  const { data: profile, update } = useProfile();

  const idFront = useRef(null);
  const idBack = useRef(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  const validate = () => {
    let valid = true;
    let formErrors: stateData = emptyData;

    // handle empty fields
    if (!state.data.address) {
      formErrors = { ...formErrors, address: "Address Required" };
      valid = false;
    }
    if (!state.data.city) {
      formErrors = { ...formErrors, city: "City Required" };
      valid = false;
    }
    if (!state.data.zip_code) {
      formErrors = { ...formErrors, zip_code: "ZIP Code Required" };
      valid = false;
    }
    if (!state.data.state) {
      formErrors = { ...formErrors, state: "State Required" };
      valid = false;
    }
    if (!state.data.country) {
      formErrors = { ...formErrors, country: "Country Required" };
      valid = false;
    }
    if (!state.data.id_front) {
      formErrors = { ...formErrors, id_front: "No ID Selected" };
      valid = false;
    }
    if (!state.data.id_back) {
      formErrors = { ...formErrors, id_back: "No ID Selected" };
      valid = false;
    }

    dispatch({ type: "error", payload: formErrors });

    return valid;
  };

  const handleSubmit = () => {
    const isValid = validate();

    if (isValid) {
      dispatch({ type: "request" });

      let formData = new FormData();
      formData.append(
        "id_front",
        state.data.id_front,
        state.data.id_front.image
      );
      formData.append("id_back", state.data.id_back, state.data.id_back.image);
      formData.append("address", state.data.address);
      formData.append("address2", state.data.address2);
      formData.append("city", state.data.city);
      formData.append("zip_code", state.data.zip_code);
      formData.append("state", state.data.state);
      formData.append("country", state.data.country);

      // console.log("form", formData);

      // for (let field of formData.entries()) {
      //   console.log(field[0] + ", " + field[1]);
      // }

      axiosInstance
        .post("/users/setup-profile/", formData)
        .then((res) => {
          console.log(res.data);
          dispatch({ type: "success" });
          update();
        })
        .catch((err) => {
          if (!err.response) {
            dispatch({ type: "server-error" });
          } else {
            if (err.response.status === 400) {
              const error = err.response.data;
              console.log({ error });
            }
          }
          console.log("bare error", err);
        });
    }
  };

  const handleInput = (e: any) => {
    if (e.target.name === "id_front" || e.target.name === "id_back") {
      dispatch({
        type: "input",
        payload: { field: e.target.name, value: e.target.files[0] },
      });
    } else {
      dispatch({
        type: "input",
        payload: { field: e.target.name, value: e.detail.value },
      });
    }
  };

  useEffect(() => {
    if (routeState === undefined) {
      return history.replace("/en/home");
    }
  }, [routeState, history]);

  return (
    <IonPage>
      <IonContent className="Profile">
        {!profile ? (
          <div className="loading-spinner">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <div className="form">
            <div className="header">
              <IonRouterLink routerDirection="root" routerLink="/home">
                <IonIcon src="coins/logo.svg" />
              </IonRouterLink>
              <h3>KYC Verification</h3>
              {!profile.profile && <p>Please verify your identity</p>}
            </div>

            {state.success || profile.profile ? (
              <div className="success">
                <div className="message complete">
                  <IonIcon icon={checkmarkCircle} />
                  {!state.success ? (
                    <>
                      <h1>Already Verified</h1>
                      <p>Your account is already verified</p>
                    </>
                  ) : (
                    <>
                      <h1>Verification Successful</h1>
                      <p>
                        Welcome {profile.full_name}, to get started Buy Crypto
                        and add your Withdrawal Details to enable Auto
                        withdrawal.
                        <br /> Click the button below to visit your dashboard
                      </p>
                    </>
                  )}
                </div>
                <IonButton mode="ios" expand="block" routerLink="/en/home">
                  <p>Go to Dashboard</p>
                </IonButton>
              </div>
            ) : (
              <div className="form-input">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      {state.data.address && <p className="label">Address</p>}
                      <IonInput
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={state.data.address}
                        onIonChange={handleInput}
                      />
                      {state.error.address && (
                        <p className="error">{state.error.address}</p>
                      )}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {state.data.address2 && (
                        <p className="label">Address 2 (Optional)</p>
                      )}
                      <IonInput
                        type="text"
                        name="address2"
                        placeholder="Address 2 (Optional)"
                        value={state.data.address2}
                        onIonChange={handleInput}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {state.data.city && <p className="label">City</p>}
                      <IonInput
                        type="text"
                        name="city"
                        placeholder="City"
                        value={state.data.city}
                        onIonChange={handleInput}
                      />
                      {state.error.city && (
                        <p className="error">{state.error.city}</p>
                      )}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {state.data.zip_code && <p className="label">ZIP Code</p>}
                      <IonInput
                        type="text"
                        name="zip_code"
                        placeholder="ZIP Code"
                        value={state.data.zip_code}
                        onIonChange={handleInput}
                      />
                      {state.error.zip_code && (
                        <p className="error">{state.error.zip_code}</p>
                      )}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {state.data.state && <p className="label">State</p>}
                      <IonInput
                        type="text"
                        name="state"
                        placeholder="State"
                        value={state.data.state}
                        onIonChange={handleInput}
                      />
                      {state.error.state && (
                        <p className="error">{state.error.state}</p>
                      )}
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      {state.data.country && <p className="label">Country</p>}
                      <IonSelect
                        name="country"
                        placeholder="Country"
                        value={state.data.country}
                        onIonChange={handleInput}
                      >
                        {Countries.map((country, i) => (
                          <IonSelectOption key={i} value={country.name}>
                            {country.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                      {state.error.country && (
                        <p className="error">{state.error.country}</p>
                      )}
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol>
                      <p className="identity">
                        You are required to provide a valid means of
                        identification to confirm your identity. Please upload
                        the front and back of your ID card
                      </p>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <input
                        ref={idFront}
                        type="file"
                        accept="image/*"
                        hidden
                        name="id_front"
                        placeholder="Upload front of ID"
                        onChange={handleInput}
                      />
                      <div className="upload">
                        <IonButton
                          mode="ios"
                          color={state.data.id_front ? "medium" : "light"}
                          onClick={() => {
                            // @ts-ignore
                            idFront.current.click();
                          }}
                        >
                          Upload front of ID
                        </IonButton>
                        <div
                          className={`selected ${
                            state.error.id_front && "error"
                          }`}
                        >
                          {state.data.id_front
                            ? state.data.id_front.name
                            : "None selected"}
                        </div>
                      </div>
                    </IonCol>
                    <IonCol>
                      <input
                        ref={idBack}
                        type="file"
                        accept="image/*"
                        hidden
                        name="id_back"
                        placeholder="Upload back of ID"
                        onChange={handleInput}
                      />
                      <div className="upload">
                        <IonButton
                          mode="ios"
                          color={state.data.id_back ? "medium" : "light"}
                          onClick={() => {
                            // @ts-ignore
                            idBack.current.click();
                          }}
                        >
                          Upload back of ID
                        </IonButton>
                        <div
                          className={`selected ${
                            state.error.id_back && "error"
                          }`}
                        >
                          {state.data.id_back
                            ? state.data.id_back.name
                            : "None selected"}
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                {state.processing && <IonProgressBar type="indeterminate" />}

                <div className="button">
                  {state.processing ? (
                    <IonButton mode="ios" expand="block">
                      <p>Verifying</p>
                      <IonSpinner name="crescent" />
                    </IonButton>
                  ) : (
                    <IonButton mode="ios" expand="block" onClick={handleSubmit}>
                      <p>Submit</p>
                    </IonButton>
                  )}
                </div>
              </div>
            )}

            <div className="brand">
              <p>{config.name} Inc.</p>
              <small>{config.location}</small>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
