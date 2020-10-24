import React, { useContext, useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  NavContext,
  IonList,
  IonLabel,
  IonItem,
  IonModal,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
  IonSelectOption,
  IonSelect,
  IonText,
  IonDatetime,
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack, arrowDown, closeCircle } from "ionicons/icons";
import "./styles/Deposit.scss";
import axiosInstance from "../../services/baseApi";
import { LoadingList } from "../../components/ListLoader";
import { useParams } from "react-router";
import { useWallets } from "../../Hooks/WalletsHook";
import useSecureRequest from "../../Hooks/SecureRequest";
import { mutate } from "swr";
import { fullDate } from "../../components/utils/Utils";

interface AddDepositItem {
  amount: number | null;
  portfolio: number | null;
  wallet: number | null;
  date_created: string | null;
}

const InitialAddDeposit: AddDepositItem = {
  amount: null,
  portfolio: null,
  wallet: null,
  date_created: null,
};

interface DepositItem {
  id: number;
  amount: number;
  portfolio: number;
  wallet: number;
  date_created: string | null;
}

const InitialDeposit: DepositItem = {
  id: 0,
  amount: 0,
  portfolio: 0,
  wallet: 0,
  date_created: null,
};

const Deposit = () => {
  const { goBack } = useContext(NavContext);

  const [showToast, setShowToast] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectDeposit, setSelectDeposit] = useState(InitialDeposit);

  const [showAddToast, setShowAddToast] = useState(false);
  const [showAddDepositModal, setShowAddDepositModal] = useState(false);
  const [addDeposit, setAddDeposit] = useState(InitialAddDeposit);

  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const { data: wallets } = useWallets();

  //test
  const { id: userId } = useParams();

  const {
    data: deposits,
    update,
  }: { data: DepositItem[]; update: () => void } = useSecureRequest(
    `/users/deposits/?id=${userId}`
  );

  const newDeposit = () => {
    // console.log("posting Deposit...");
    if (!addDeposit.amount || !addDeposit.portfolio || !addDeposit.wallet) {
      // console.log("incomplete post data");
    } else {
      axiosInstance
        .post("/users/deposits/", addDeposit)
        .then((res) => {
          // console.log(res.data);
          setShowAddDepositModal(false);
          setShowAddToast(true);
          update();
          mutate(`/users/profile/?id=${userId}`);
        })
        .catch((err) => {
          // console.log(err.response);
        });
    }
  };

  const handleDeposit = (deposit: any) => {
    setSelectDeposit((current) => ({ ...current, ...deposit }));
    setShowDepositModal(true);
  };

  const updateDeposit = () => {
    // console.log("updating Deposit...");
    axiosInstance
      .put(`/users/deposits/${selectDeposit.id}/`, selectDeposit)
      .then((res) => {
        // console.log(res.data);
        setShowDepositModal(false);
        setShowToast(true);
        update();
        mutate(`/users/profile/?id=${userId}`);
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const deleteDeposit = () => {
    // console.log("deleting Deposit...");
    axiosInstance
      .delete(`/users/deposits/${selectDeposit.id}/`)
      .then((res) => {
        // console.log(res.data);
        setShowDepositModal(false);
        setShowDeleteToast(true);
        update();
        mutate(`/users/profile/?id=${userId}`);
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const getWallet = (id: number) => {
    let result = null;
    if (wallets) {
      result = wallets.find((w) => w.id === id);
    }
    return result ? result?.wallet : "";
  };

  useEffect(() => {
    // console.log("setting user " + userId);
    setAddDeposit((current) => ({ ...current, portfolio: userId }));
  }, [userId, wallets]);

  return (
    <IonPage className="AdminDeposit">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack()}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Deposits</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* refresher */}
        <Refresher />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Deposit updated successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showAddToast}
          onDidDismiss={() => setShowAddToast(false)}
          message="Deposit added successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showDeleteToast}
          onDidDismiss={() => setShowDeleteToast(false)}
          message="Deposit deleted successfully"
          duration={1000}
        />

        <div className="button">
          <IonButton
            color="success"
            mode="ios"
            onClick={() => setShowAddDepositModal(true)}
          >
            Add Deposit
          </IonButton>
        </div>
        {!deposits ? (
          <LoadingList />
        ) : (
          <IonList mode="ios">
            {deposits.length > 0 ? (
              deposits.map((deposit) => (
                <IonItem
                  onClick={() => handleDeposit(deposit)}
                  key={deposit.id}
                  className="DepositItem ion-no-padding"
                >
                  <div className="icon">
                    <IonIcon icon={arrowDown} />
                  </div>
                  <IonLabel className="description">
                    <h3>{deposit.amount} USD</h3>
                    <p>Deposit</p>
                  </IonLabel>
                  <IonLabel className="amount">
                    <h5>{getWallet(deposit.wallet)}</h5>
                    <p>{fullDate(deposit.date_created!)}</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonText className="no-result">
                <h3>No transactions found</h3>
                <p>All Deposits will appear here</p>
              </IonText>
            )}
            {}
          </IonList>
        )}
        <IonModal
          isOpen={showDepositModal}
          swipeToClose={true}
          cssClass="deposit-modal"
          onDidDismiss={() => setShowDepositModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Update Deposit</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowDepositModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="details">
              <div className="entry">
                <p>Amount:</p>
                <p>{selectDeposit.amount} USD</p>
              </div>
              <div className="entry">
                <p>Date:</p>
                <p>{fullDate(selectDeposit.date_created!)}</p>
              </div>
            </div>
            <div className="input">
              <div className="input-box">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Amount"
                        clearInput
                        value={selectDeposit.amount}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setSelectDeposit((current) => ({
                            ...current,
                            amount: value,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonDatetime
                        value={selectDeposit.date_created}
                        placeholder="Leave blank for default"
                        pickerFormat="MMM DD, YYYY HH:mm"
                        onIonChange={(e) => {
                          setSelectDeposit((current) => ({
                            ...current,
                            date_created: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => updateDeposit()}>
                  Update Deposit
                </IonButton>
              </div>
              <div className="delete">
                <p onClick={() => deleteDeposit()}>Delete Deposit</p>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showAddDepositModal}
          swipeToClose={true}
          cssClass="deposit-modal"
          onDidDismiss={() => setShowAddDepositModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Add Deposit</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowAddDepositModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="input">
              <div className="input-box">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Amount"
                        clearInput
                        value={addDeposit.amount}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setAddDeposit((current) => ({
                            ...current,
                            amount: value,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonSelect
                        interface="action-sheet"
                        value={addDeposit.wallet}
                        placeholder="Wallet"
                        onIonChange={(e) => {
                          setAddDeposit((current) => ({
                            ...current,
                            wallet: e.detail.value,
                          }));
                        }}
                      >
                        {wallets &&
                          wallets.map(({ wallet, id }) => (
                            <IonSelectOption key={id} value={id}>
                              {wallet}
                            </IonSelectOption>
                          ))}
                      </IonSelect>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonDatetime
                        value={addDeposit.date_created}
                        placeholder="Leave blank for default"
                        pickerFormat="MMM DD, YYYY HH:mm"
                        onIonChange={(e) => {
                          setAddDeposit((current) => ({
                            ...current,
                            date_created: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => newDeposit()}>
                  Add Deposit
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Deposit;
