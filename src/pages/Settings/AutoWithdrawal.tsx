import React, { useContext, useReducer, useState } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  NavContext,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import {
  arrowBack,
  closeCircle,
  alertCircle,
  checkmarkCircle,
} from "ionicons/icons";
import "./styles/AutoWithdrawal.scss";
import { useProfile } from "../../Hooks/ProfileHook";
import axiosInstance from "../../services/baseApi";

import validator from "card-validator";
//@ts-ignore
import Cards from "react-credit-cards";
import "react-credit-cards/lib/styles.scss";
import FullSpinner from "../../components/FullSpinner";

const specialCountires = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
];

interface profileProp {
  loading: boolean;
  error: boolean;
  focus: string | null;
  ssn_error: string;
  data: {
    first_name: string;
    last_name: string;
    card_number: string;
    exp_month: number | null;
    exp_year: number | null;
    cvv: number | null;
    ssn: string;
  };
}

const initialState = {
  loading: false,
  error: false,
  focus: null,
  ssn_error: "",
  data: {
    first_name: "",
    last_name: "",
    card_number: "",
    exp_month: null,
    exp_year: null,
    cvv: null,
    ssn: "",
  },
};

const profileReducer = (state: profileProp, { type, field, value }: any) => {
  switch (type) {
    case "request":
      return {
        ...state,
        ssn_error: "",
        loading: !state.loading,
      };
    case "server_error":
      return {
        ...state,
        loading: false,
        error: true,
      };
    case "ssn_error":
      return {
        ...state,
        ssn_error: "Please make sure this field is valid",
      };
    case "input":
      state = {
        ...state,
        data: {
          ...state.data,
          [field]: value,
        },
      };
      switch (field) {
        case "card_number":
          state = {
            ...state,
            focus: "number",
          };
          break;
        case "first_name":
          state = {
            ...state,
            focus: "name",
          };
          break;
        case "last_name":
          state = {
            ...state,
            focus: "name",
          };
          break;
        case "cvv":
          state = {
            ...state,
            focus: "cvc",
          };
          break;
        case "exp_month":
          state = {
            ...state,
            focus: "expiry",
          };
          break;
        case "exp_year":
          state = {
            ...state,
            focus: "expiry",
          };
          break;
        default:
          break;
      }
      return state;
    default:
      return state;
  }
};

export const expiryString = (
  month: number,
  year: number,
  slash: boolean = false
) => {
  let mm = month.toString();
  let yyyy = year.toString();

  if (mm.length === 1) {
    if (slash) {
      mm = "0" + mm + "/";
    } else {
      mm = "0" + mm;
    }
  }
  return mm + yyyy;
};

const listMaker = (length: number, start: number) => {
  let raw = new Array(length).fill(length);
  const res = raw.map((total, i) => {
    let entry = (start + i).toString();
    if (entry.length === 1) {
      entry = "0" + entry;
    }
    return entry;
  });
  return res;
};

const yearList = () => {
  const thisYear = new Date().getFullYear();
  return listMaker(19, thisYear);
};

const monthList = () => {
  return listMaker(12, 1);
};

export const socialSecurity = (country: string) => {
  let status = {
    required: false,
    alphanumeric: false,
    full_name: "",
    short_name: "",
  };
  switch (country) {
    case "United States":
      status = {
        required: true,
        alphanumeric: false,
        full_name: "Social Security Number",
        short_name: "SSN",
      };
      break;
    case "Canada":
      status = {
        required: true,
        alphanumeric: false,
        full_name: "Social Insurance Number",
        short_name: "SIN",
      };
      break;
    case "United Kingdom":
      status = {
        required: true,
        alphanumeric: true,
        full_name: "National Insurance Number",
        short_name: "NINO",
      };
      break;
    case "Australia":
      status = {
        required: true,
        alphanumeric: false,
        full_name: "Tax File Number",
        short_name: "TFN",
      };
      break;
    default:
      break;
  }
  return status;
};

const validateSocialSecurity = (ssn: string, country: string) => {
  const digitOnly = /^\d+$/;
  const alphaNumeric = /^(?=.*[A-Z])(?=.*[0-9])/;

  switch (country) {
    case "United States":
      if (ssn.length < 9 || digitOnly.test(ssn) === false) {
        return false;
      }
      break;
    case "Canada":
      if (ssn.length < 9 || digitOnly.test(ssn) === false) {
        return false;
      }
      break;
    case "United Kingdom":
      if (ssn.length < 9 || alphaNumeric.test(ssn) === false) {
        return false;
      }
      break;
    case "Australia":
      if (ssn.length < 9 || digitOnly.test(ssn) === false) {
        return false;
      }
      break;
    default:
      break;
  }
  return true;
};

const AutoWithdrawal = () => {
  const { goBack } = useContext(NavContext);
  const { data: profile, update } = useProfile();

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [profileData, dispatch] = useReducer(profileReducer, initialState);

  const checkIssuer = (number: string) => {
    const res = validator.number(number);
    return res.card?.type;
  };

  const validCheck = () => {
    let isPotential = true;
    let isValid = false;

    const validateNumber = () => {
      const res = validator.number(profileData.data.card_number);
      return { valid: res.isValid, potential: res.isPotentiallyValid };
    };

    const validateCvv = () => {
      const res = validator.cvv(profileData.data.cvv || "");
      return { valid: res.isValid, potential: res.isPotentiallyValid };
    };

    const validateFields = () => {
      let valid = true;
      if (profileData.data.first_name.length <= 1) {
        valid = false;
      }
      if (profileData.data.last_name.length <= 1) {
        valid = false;
      }
      if (!profileData.data.exp_month) {
        valid = false;
      }
      if (!profileData.data.exp_year) {
        valid = false;
      }
      return valid;
    };

    isValid = validateNumber().valid && validateCvv().valid && validateFields();
    isPotential = validateNumber().potential && validateCvv().potential;

    return { isPotential, isValid };
  };

  const { isPotential, isValid } = validCheck();

  const inputChange = (e: any) => {
    dispatch({ type: "input", field: e.target.name, value: e.detail.value });
  };

  const handleSubmit = () => {
    if (specialCountires.includes(profile.profile.country)) {
      if (
        !validateSocialSecurity(profileData.data.ssn, profile.profile.country)
      ) {
        return dispatch({ type: "ssn_error" });
      }
    }
    dispatch({ type: "request" });

    axiosInstance
      .post("/users/card/", profileData.data)
      .then((res) => {
        dispatch({ type: "request" });
        update();
        setShowAddCardModal(false);
        // console.log(res.data);
      })
      .catch((e) => {
        dispatch({ type: "server_error" });
        // console.log(e.response);
      });
  };

  return (
    <IonPage>
      <IonContent className="AutoWithdrawal">
        <IonIcon
          className="back-button"
          icon={arrowBack}
          onClick={() => goBack("/en/settings")}
        />
        <Refresher />
        {!profile ? (
          <FullSpinner />
        ) : (
          <div className="body">
            <div className="card">
              {profile?.card ? (
                <Cards
                  cvc={profile?.card.cvv || ""}
                  expiry={expiryString(
                    profile?.card.exp_month,
                    profile?.card.exp_year
                  )}
                  name={
                    profile?.card
                      ? profile.card.first_name + " " + profile.card.last_name
                      : "CARD HOLDER"
                  }
                  number={profile?.card.card_number || ""}
                />
              ) : (
                <Cards
                  cvc=""
                  expiry=""
                  name=""
                  number=""
                  placeholders={{ name: "CARD HOLDER" }}
                />
              )}
            </div>
            {profile?.card ? (
              <div className="message complete">
                <IonIcon icon={checkmarkCircle} />
                <h1>You are all set</h1>
                <p>
                  Auto withdrawal is active. You can now receive funds directly
                  to your {checkIssuer(profile.card.card_number)} card
                </p>
              </div>
            ) : (
              <div className="message pending">
                <IonIcon icon={alertCircle} />
                <h1>You have not set up your withdrawal method</h1>
                <p>Please complete setup to enable Auto Withdrawal</p>
              </div>
            )}

            {!profile?.card && (
              <IonButton
                mode="ios"
                expand="block"
                onClick={() => setShowAddCardModal(true)}
                className="action"
              >
                Setup
              </IonButton>
            )}
          </div>
        )}
        {profile && (
          <IonModal
            isOpen={showAddCardModal}
            swipeToClose={true}
            cssClass="auto-withdrawal-modal"
            onDidDismiss={() => setShowAddCardModal(false)}
          >
            <IonHeader className="ion-no-border" mode="ios">
              <IonToolbar>
                <IonTitle>Add Withdrawal Method</IonTitle>
                <IonIcon
                  className="back-button"
                  icon={closeCircle}
                  onClick={() => setShowAddCardModal(false)}
                  slot="end"
                />
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="card">
                <Cards
                  cvc={profileData.data.cvv || ""}
                  expiry={
                    profileData.data.exp_month && profileData.data.exp_year
                      ? expiryString(
                          profileData.data.exp_month,
                          profileData.data.exp_year
                        )
                      : ""
                  }
                  focused={profileData.focus}
                  name={
                    profileData.data.first_name || profileData.data.last_name
                      ? profileData.data.first_name +
                        " " +
                        profileData.data.last_name
                      : ""
                  }
                  number={profileData.data.card_number}
                  // callback={(type: any, isValid: boolean) => {
                  //   console.log("react validator", type, isValid);
                  // }}
                />
              </div>
              <div className="input">
                <div className="input-box">
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonInput
                          placeholder="Card Number"
                          type="tel"
                          value={profileData.data.card_number}
                          name="card_number"
                          onIonChange={inputChange}
                        />
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonInput
                          placeholder="First Name"
                          value={profileData.data.first_name}
                          name="first_name"
                          onIonChange={inputChange}
                        />
                      </IonCol>
                      <IonCol>
                        <IonInput
                          placeholder="Last Name"
                          value={profileData.data.last_name}
                          name="last_name"
                          onIonChange={inputChange}
                        />
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonSelect
                          interface="popover"
                          value={profileData.data.exp_month}
                          name="exp_month"
                          placeholder="Month"
                          onIonChange={inputChange}
                        >
                          {monthList().map((month) => (
                            <IonSelectOption
                              key={month}
                              value={parseInt(month)}
                            >
                              {month}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonCol>
                      <IonCol>
                        <IonSelect
                          interface="popover"
                          value={profileData.data.exp_year}
                          name="exp_year"
                          placeholder="Year"
                          onIonChange={inputChange}
                        >
                          {yearList().map((year) => (
                            <IonSelectOption key={year} value={parseInt(year)}>
                              {year}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonInput
                          type="tel"
                          placeholder="Security Code"
                          value={profileData.data.cvv}
                          name="cvv"
                          onIonChange={inputChange}
                        />
                      </IonCol>
                    </IonRow>
                    {socialSecurity(profile.profile.country).required && (
                      <IonRow>
                        <IonCol>
                          <IonInput
                            type={
                              socialSecurity(profile.profile.country)
                                .alphanumeric
                                ? "text"
                                : "tel"
                            }
                            name="ssn"
                            placeholder={
                              socialSecurity(profile.profile.country)
                                .short_name +
                              " (" +
                              socialSecurity(profile.profile.country)
                                .full_name +
                              ")"
                            }
                            value={profileData.data.ssn}
                            onIonChange={inputChange}
                          />
                          {profileData.ssn_error && (
                            <p className="error">{profileData.ssn_error}</p>
                          )}
                        </IonCol>
                      </IonRow>
                    )}
                  </IonGrid>
                  {profileData.error && (
                    <p className="error">
                      Something went wrong, try again later
                    </p>
                  )}
                </div>
                {profileData.loading ? (
                  <div className="button valid" onClick={handleSubmit}>
                    <IonButton mode="ios">
                      Submitting
                      <IonSpinner name="crescent" />
                    </IonButton>
                  </div>
                ) : isPotential ? (
                  isValid ? (
                    <div className="button valid" onClick={handleSubmit}>
                      <IonButton mode="ios">Add Card</IonButton>
                    </div>
                  ) : (
                    <div className="button">
                      <IonButton mode="ios">
                        Please fill in your credentials
                      </IonButton>
                    </div>
                  )
                ) : (
                  <div className="button invalid">
                    <IonButton mode="ios">Please add a valid card</IonButton>
                  </div>
                )}
              </div>
            </IonContent>
          </IonModal>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AutoWithdrawal;
