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
} from "@ionic/react";
import Refresher from "../../components/utils/Refresher";
import { arrowBack, arrowUp, closeCircle } from "ionicons/icons";
import "./styles/Withdrawal.scss";
import axiosInstance from "../../services/baseApi";
import { LoadingList } from "../../components/ListLoader";
import { useParams } from "react-router";
import { useWallets } from "../../Hooks/WalletsHook";
import useSecureRequest from "../../Hooks/SecureRequest";

interface AddWithdrawalItem {
  completed: boolean;
  amount: number | null;
  portfolio: number | null;
  wallet: string;
}

const InitialAddWithdrawal: AddWithdrawalItem = {
  completed: false,
  amount: null,
  portfolio: null,
  wallet: "",
};

interface AddBillingsItem {
  amount: number | null;
  title: string;
  withdrawal: number | null;
}

const InitialBilling: AddBillingsItem = {
  amount: null,
  title: "",
  withdrawal: null,
};

interface BillingsItem {
  id: number;
  amount: number;
  title: string;
  withdrawal: number;
}

interface WithdrawalItem {
  id: number;
  completed: boolean;
  amount: number;
  portfolio: number;
  wallet: string;
  billings: BillingsItem[];
}

const InitialWithdrawal: WithdrawalItem = {
  id: 0,
  completed: false,
  amount: 0,
  portfolio: 0,
  wallet: "",
  billings: [],
};

const Withdrawal = () => {
  const { goBack } = useContext(NavContext);

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectWithdrawal, setSelectWithdrawal] = useState(InitialWithdrawal);

  const [showAddToast, setShowAddToast] = useState(false);
  const [showAddWithdrawalModal, setShowAddWithdrawalModal] = useState(false);
  const [addWithdrawal, setAddWithdrawal] = useState(InitialAddWithdrawal);

  const [showBillingToast, setShowBillingToast] = useState(false);
  const [billing, setBilling] = useState(InitialBilling);

  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  const { data: wallets } = useWallets();

  //test
  const { id: userId } = useParams();

  const {
    data: withdrawals,
    update,
  }: { data: WithdrawalItem[]; update: () => void } = useSecureRequest(
    `/users/withdrawals/?id=${userId}`
  );

  const newWithdrawal = () => {
    // console.log("posting Withdrawal...");
    if (
      !addWithdrawal.amount ||
      !addWithdrawal.portfolio ||
      !addWithdrawal.wallet
    ) {
      // console.log("incomplete post data");
    } else {
      axiosInstance
        .post("/users/withdrawals/", addWithdrawal)
        .then((res) => {
          // console.log(res.data);
          setShowAddWithdrawalModal(false);
          setShowAddToast(true);
          update();
        })
        .catch((err) => {
          // console.log(err.response);
        });
    }
  };

  const toggleStatus = () => {
    // console.log("toggling withdrawal status...");
    axiosInstance
      .put(`/users/add-withdrawals/${selectWithdrawal.id}/`, {
        wallet: selectWithdrawal.wallet,
        amount: selectWithdrawal.amount,
        completed: !selectWithdrawal.completed,
        portfolio: selectWithdrawal.portfolio,
      })
      .then((res) => {
        // console.log(res.data);
        setShowWithdrawalModal(false);
        setShowUpdateToast(true);
        update();
      })
      .catch((err) => {
        // console.log(err.response);
        setSelectWithdrawal(InitialWithdrawal);
        setShowWithdrawalModal(false);
      });
  };

  const handleWithdrawal = (withdrawal: WithdrawalItem) => {
    setSelectWithdrawal((current) => ({ ...current, ...withdrawal }));
    setBilling((current) => ({ ...current, withdrawal: withdrawal.id }));
    setShowWithdrawalModal(true);
  };

  const addBilling = () => {
    // console.log("adding billing...");
    if (!billing.amount || !billing.title) {
      // console.log("incomplete post data");
    } else {
      axiosInstance
        .post("/users/billings/", billing)
        .then((res) => {
          // console.log(res.data);
          setShowWithdrawalModal(false);
          setShowBillingToast(true);
          setBilling(InitialBilling);
          update();
        })
        .catch((err) => {
          // console.log(err.response);
        });
    }
  };

  const deleteWithdrawal = () => {
    // console.log("deleting Withdrawal...");
    axiosInstance
      .delete(`/users/add-withdrawals/${selectWithdrawal.id}/`)
      .then((res) => {
        // console.log(res.data);
        setShowWithdrawalModal(false);
        setShowDeleteToast(true);
        update();
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const getWallet = (symbol: string) => {
    const result = wallets.find((w) => w.symbol === symbol);
    return result?.wallet;
  };

  useEffect(() => {
    // console.log("setting user " + userId);
    setAddWithdrawal((current) => ({ ...current, portfolio: userId }));
  }, [userId]);

  return (
    <IonPage className="AdminWithdrawal">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack()}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Withdrawals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* refresher */}
        <Refresher />
        <IonToast
          isOpen={showBillingToast}
          onDidDismiss={() => setShowBillingToast(false)}
          message="Billing added successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showAddToast}
          onDidDismiss={() => setShowAddToast(false)}
          message="Withdrawal added successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showDeleteToast}
          onDidDismiss={() => setShowDeleteToast(false)}
          message="Withdrawal deleted successfully"
          duration={1000}
        />
        <IonToast
          isOpen={showUpdateToast}
          onDidDismiss={() => setShowUpdateToast(false)}
          message="Withdrawal updated successfully"
          duration={1000}
        />

        <div className="button">
          <IonButton
            color="warning"
            mode="ios"
            onClick={() => setShowAddWithdrawalModal(true)}
          >
            Add Withdrawal
          </IonButton>
        </div>
        {!withdrawals ? (
          <LoadingList />
        ) : (
          <IonList mode="ios">
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <IonItem
                  onClick={() => handleWithdrawal(withdrawal)}
                  key={withdrawal.id}
                  className="WithdrawalItem ion-no-padding"
                >
                  <div className="icon">
                    <IonIcon icon={arrowUp} />
                  </div>
                  <IonLabel className="description">
                    <h3>{withdrawal.amount} USD</h3>
                    <p>{getWallet(withdrawal.wallet)} wallet</p>
                  </IonLabel>
                  <IonLabel className="amount">
                    <h5>{withdrawal.completed ? "Completed" : "Pending"}</h5>
                    <p>{withdrawal.billings.length} Billings</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonText className="no-result">
                <h3>No transactions found</h3>
                <p>All Withdrawals will appear here</p>
              </IonText>
            )}
            {}
          </IonList>
        )}
        <IonModal
          isOpen={showWithdrawalModal}
          swipeToClose={true}
          cssClass="withdrawal-modal"
          onDidDismiss={() => setShowWithdrawalModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Update Withdrawal</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowWithdrawalModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="details">
              <div className="entry">
                <p>Amount:</p>
                <p>{selectWithdrawal.amount} USD</p>
              </div>
              <div className="billings">
                {selectWithdrawal.billings.length > 0 ? (
                  <>
                    <h1>Billings:</h1>
                    {selectWithdrawal.billings.map((billing) => (
                      <div key={billing.id} className="entry">
                        <p>{billing.title}:</p>
                        <p>{billing.amount} USD</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="no-result">No billings for this transaction</p>
                )}
              </div>
            </div>
            <div className="input">
              <div className="input-box">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="text"
                        placeholder="Billing Title"
                        clearInput
                        value={billing.title}
                        onIonChange={(e) => {
                          setBilling((current) => ({
                            ...current,
                            title: e.detail.value!,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Amount"
                        clearInput
                        value={billing.amount}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setBilling((current) => ({
                            ...current,
                            amount: value,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => addBilling()}>
                  Add Billing
                </IonButton>
              </div>
              {selectWithdrawal.completed ? (
                <div className="pending" onClick={() => toggleStatus()}>
                  <p>Set Pending</p>
                </div>
              ) : (
                <div className="complete" onClick={() => toggleStatus()}>
                  <p>Set Complete</p>
                </div>
              )}
              <div className="delete">
                <p onClick={() => deleteWithdrawal()}>Delete Withdrawal</p>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showAddWithdrawalModal}
          swipeToClose={true}
          cssClass="withdrawal-modal"
          onDidDismiss={() => setShowAddWithdrawalModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Add Withdrawal</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowAddWithdrawalModal(false)}
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
                        value={addWithdrawal.amount}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setAddWithdrawal((current) => ({
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
                        value={addWithdrawal.wallet}
                        placeholder="Wallet"
                        onIonChange={(e) => {
                          setAddWithdrawal((current) => ({
                            ...current,
                            wallet: e.detail.value,
                          }));
                        }}
                      >
                        {wallets &&
                          wallets.map(({ wallet, id, symbol }) => (
                            <IonSelectOption key={id} value={symbol}>
                              {wallet}
                            </IonSelectOption>
                          ))}
                      </IonSelect>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => newWithdrawal()}>
                  Add Withdrawal
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Withdrawal;
