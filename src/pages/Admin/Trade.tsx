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
import { arrowBack, swapHorizontal, closeCircle } from "ionicons/icons";
import "./styles/Trade.scss";
import axiosInstance from "../../services/baseApi";
import { LoadingList, ErrorList } from "../../components/ListLoader";
import { useWallets } from "../../Context/WalletContext";
import { useParams } from "react-router";

interface AddTradeItem {
  amount: number | null;
  type: string;
  profit: number | null;
  duration: number | null;
  portfolio: number | null;
  wallet: number | null;
}

const InitialAddTrade: AddTradeItem = {
  amount: null,
  type: "",
  profit: null,
  duration: null,
  portfolio: null,
  wallet: null,
};

interface TradeItem {
  amount: number;
  current: number;
  duration: number;
  id: number;
  portfolio: number;
  profit: number;
  type: string;
  wallet: number;
}

const InitialTrade: TradeItem = {
  amount: 0,
  current: 0,
  duration: 0,
  id: 0,
  portfolio: 0,
  profit: 0,
  type: "",
  wallet: 0,
};

const Trade = () => {
  const { goBack } = useContext(NavContext);
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectTrade, setSelectTrade] = useState(InitialTrade);

  const [showAddToast, setShowAddToast] = useState(false);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [addTrade, setAddTrade] = useState(InitialAddTrade);

  const [showDeleteToast, setShowDeleteToast] = useState(false);

  const { wallets, loading: loadingWallets } = useWallets();

  //test
  const { id: userId } = useParams();

  const newTrade = () => {
    // console.log("posting trade...");
    if (
      !addTrade.amount ||
      !addTrade.type ||
      !addTrade.duration ||
      !addTrade.portfolio ||
      !addTrade.wallet
    ) {
      // console.log("incomplete post data");
    } else {
      axiosInstance
        .post("users/trades/", addTrade)
        .then((res) => {
          // console.log(res.data);
          setShowAddTradeModal(false);
          setShowAddToast(true);
        })
        .catch((err) => {
          // console.log(err.response);
        });
    }
  };

  const handleTrade = (trade: any) => {
    setSelectTrade((current) => ({ ...current, ...trade }));
    setShowTradeModal(true);
  };

  const updateTrade = () => {
    // console.log("updating trade...");
    axiosInstance
      .put(`users/trades/${selectTrade.id}/`, selectTrade)
      .then((res) => {
        // console.log(res.data);
        setShowTradeModal(false);
        setShowToast(true);
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  const deleteTrade = () => {
    // console.log("deleting trade...");
    axiosInstance
      .delete(`users/trades/${selectTrade.id}/`)
      .then((res) => {
        // console.log(res.data);
        setShowTradeModal(false);
        setShowDeleteToast(true);
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  useEffect(() => {
    // console.log("setting user " + userId);
    setAddTrade((current) => ({ ...current, portfolio: userId }));
    // console.log("fetching trades...");
    axiosInstance
      .get("users/trades/?id=" + userId)
      .then((res) => {
        setTrades(res.data);
        // console.log(res.data);
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        // console.log(err.response);
        setError(true);
        setLoading(false);
      });
  }, [showToast, showAddToast, showDeleteToast, userId]);

  return (
    <IonPage className="AdminTrade">
      <IonHeader className="ion-no-border" mode="ios">
        <IonToolbar>
          <div className="back" onClick={() => goBack()}>
            <IonIcon className="back-button" icon={arrowBack} />
          </div>
          <IonTitle>Trades</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* refresher */}
        <Refresher />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Trade updated successfully"
          duration={2000}
        />
        <IonToast
          isOpen={showAddToast}
          onDidDismiss={() => setShowAddToast(false)}
          message="Trade added successfully"
          duration={2000}
        />
        <IonToast
          isOpen={showDeleteToast}
          onDidDismiss={() => setShowDeleteToast(false)}
          message="Trade deleted successfully"
          duration={2000}
        />

        <div className="button">
          <IonButton mode="ios" onClick={() => setShowAddTradeModal(true)}>
            Add Trade
          </IonButton>
        </div>
        {loading ? (
          <LoadingList />
        ) : error ? (
          <ErrorList />
        ) : (
          <IonList mode="ios">
            {trades.length > 0 ? (
              trades.map((trade) => (
                <IonItem
                  onClick={() => handleTrade(trade)}
                  key={trade.id}
                  className="TradeItem ion-no-padding"
                >
                  <div className="icon">
                    <IonIcon icon={swapHorizontal} />
                  </div>
                  <IonLabel className="description">
                    <h3>{trade.amount} USD</h3>
                    <p>
                      {trade.duration} {trade.duration > 1 ? "Days" : "Day"}
                    </p>
                  </IonLabel>
                  <IonLabel className="amount">
                    <h5>{trade.profit} USD</h5>
                    <p>{trade.current.toFixed(4)} USD</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonText className="no-result">
                <h3>No transactions found</h3>
                <p>All trades will appear here</p>
              </IonText>
            )}
            {}
          </IonList>
        )}
        <IonModal
          isOpen={showTradeModal}
          swipeToClose={true}
          cssClass="trade-modal"
          onDidDismiss={() => setShowTradeModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Update Trade</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowTradeModal(false)}
                slot="end"
              />
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="details">
              <div className="entry">
                <p>Capital:</p>
                <p>{selectTrade.amount} USD</p>
              </div>
              <div className="entry">
                <p>Duration:</p>
                <p>{selectTrade.duration}</p>
              </div>
              <div className="entry">
                <p>Profit:</p>
                <p>{selectTrade.profit}</p>
              </div>
              <div className="entry">
                <p>Current:</p>
                <p>{selectTrade.current?.toFixed(4)}</p>
              </div>
            </div>
            <div className="input">
              <div className="input-box">
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Capital"
                        clearInput
                        value={selectTrade.amount}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setSelectTrade((current) => ({
                            ...current,
                            amount: value,
                          }));
                        }}
                      />
                      <p>Capital</p>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Duration"
                        clearInput
                        value={selectTrade.duration}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setSelectTrade((current) => ({
                            ...current,
                            duration: value,
                          }));
                        }}
                      />
                      <p>Duration</p>
                    </IonCol>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Profit"
                        clearInput
                        value={selectTrade.profit}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setSelectTrade((current) => ({
                            ...current,
                            profit: value,
                          }));
                        }}
                      />
                      <p>Profit</p>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => updateTrade()}>
                  Update Trade
                </IonButton>
              </div>
              <div className="delete">
                <p onClick={() => deleteTrade()}>Delete Trade</p>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showAddTradeModal}
          swipeToClose={true}
          cssClass="trade-modal"
          onDidDismiss={() => setShowAddTradeModal(false)}
        >
          <IonHeader className="ion-no-border" mode="ios">
            <IonToolbar>
              <IonTitle>Add Trade</IonTitle>
              <IonIcon
                className="back-button"
                icon={closeCircle}
                onClick={() => setShowAddTradeModal(false)}
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
                        placeholder="Capital"
                        clearInput
                        value={addTrade.amount}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setAddTrade((current) => ({
                            ...current,
                            amount: value,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Duration"
                        clearInput
                        value={addTrade.duration}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setAddTrade((current) => ({
                            ...current,
                            duration: value,
                          }));
                        }}
                      />
                    </IonCol>
                    <IonCol>
                      <IonInput
                        type="number"
                        placeholder="Profit"
                        clearInput
                        value={addTrade.profit}
                        onIonChange={(e) => {
                          let value = parseFloat(e.detail.value!);
                          if (isNaN(value)) {
                            value = 0;
                          }
                          setAddTrade((current) => ({
                            ...current,
                            profit: value,
                          }));
                        }}
                      />
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonSelect
                        interface="action-sheet"
                        value={addTrade.type}
                        placeholder="Order"
                        onIonChange={(e) => {
                          setAddTrade((current) => ({
                            ...current,
                            type: e.detail.value,
                          }));
                        }}
                      >
                        <IonSelectOption value="buy">Buy Order</IonSelectOption>
                        <IonSelectOption value="sell">
                          Sell Order
                        </IonSelectOption>
                        <IonSelectOption value="smart">
                          Copy Trade
                        </IonSelectOption>
                      </IonSelect>
                    </IonCol>
                    <IonCol>
                      <IonSelect
                        interface="action-sheet"
                        value={addTrade.wallet}
                        placeholder="Wallet"
                        onIonChange={(e) => {
                          setAddTrade((current) => ({
                            ...current,
                            wallet: e.detail.value,
                          }));
                        }}
                      >
                        {!loadingWallets &&
                          wallets.map(({ wallet, id }) => (
                            <IonSelectOption key={id} value={id}>
                              {wallet}
                            </IonSelectOption>
                          ))}
                      </IonSelect>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </div>
              <div className="button">
                <IonButton mode="ios" onClick={() => newTrade()}>
                  Add Trade
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Trade;
